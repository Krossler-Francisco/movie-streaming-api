# Movie Streaming

This project presents a solution for a movie streaming server using **Node.js** and **Express**. The core idea is to efficiently deliver content to clients by splitting the video file into small parts (**chunks**) and sending them gradually, which prevents memory saturation on both the server and the client.

## The Challenge of Streaming Large Files

When you try to send a large file all at once over the internet, sending it without any containment can present several problems:

-   **Server Memory Saturation:** The server would have to load the entire video file into memory before sending it. For popular movies or many concurrent users, this would quickly exhaust the server's available RAM, causing failures and slow performance in the best-case scenario.
-   **Client Memory Overload:** Similarly, the client's device would need to download and store the entire file before playback could even begin. This is impractical for large files and can lead to a poor user experience, especially on devices with limited memory.
-   **Slow Start Times:** Users would experience long waiting times as the entire file downloads before they can watch anything.
-   **Lack of Seek Functionality:** Without a mechanism to request specific parts of a file, features like fast-forwarding or rewinding would be impossible.

## Solution: HTTP Chunks

To overcome these problems, the backend employs a **streaming approach** where video files are sent in small, manageable pieces (**chunks**). This method offers several key advantages:

-   **Efficient Memory Usage:** Neither the server nor the client needs to hold the entire file in memory. The server reads and sends only the requested chunk, and the client receives and processes only that chunk.
-   **Instant Playback:** As soon as the first few chunks arrive, the client can begin playing the video.
-   **Seeking:** The client can request specific parts of the video (e.g., jump to the middle of the movie) by specifying the desired range of bytes.
-   **Improved Scalability:** By not having to load entire files, the server can handle many more concurrent streaming requests, making the application more scalable.

![Diagram](https://res.cloudinary.com/dwnf4oghd/image/upload/v1750567117/Stream_Diagram_g9ymxo.jpg)

## How HTTP Range Works

The "streaming" functionality resides in the **HTTP `Range` header**. This HTTP feature allows the client to request only a specific portion of a resource from the server.

Here's how it works:

1.  **Client Request:** When a client wants to stream a video, it typically sends an initial request to the server. If it wants a specific part (e.g., to resume playback or seek), it includes a `Range` header in its HTTP GET request, like this:
    
    ```
    Range: bytes=0-1023
    ```
    
    This requests the first 1024 bytes of the file. If the client is seeking, it might send:
    
    ```
    Range: bytes=5242880-
    ```
    
    This requests the file from byte 5,242,880 to the end.
    
2.  **Server Response:** Upon receiving a `Range` header, the server:
    
    -   Reads the requested range of bytes from the video file.
    -   Sets the `Content-Range` header in its response to indicate which part of the file is being sent (e.g., `Content-Range: bytes 0-1023/1234567`).
    -   Sets the `Content-Length` header to the size of the _chunk_ being sent, not the entire file.
    -   Sends an HTTP `206 Partial Content` status code, indicating that only part of the resource is being delivered.
3.  **Continuous Streaming:** The client continuously requests subsequent chunks as needed for smooth playback. This back-and-forth communication allows for dynamic loading of video content, ensuring an uninterrupted viewing experience.

## Technologies

-   **Node.js**: A powerful JavaScript runtime for building scalable network applications.
-   **Express**: A fast, unopinionated, minimalist web framework for Node.js.
-   **Render**: (Deployment) A cloud platform to host and scale your applications.
-   **Streaming via Range**: Leveraging the HTTP `Range` header for efficient partial content delivery.

----------

## Modular Project Structure

-   `routes/`: HTTP endpoints and routes.
-   `controllers/`: Input/output logic, processes requests and prepares responses.
-   `services/`: Core streaming logic and request rules.
-   `assets/`: A dedicated folder where video files to be served are stored. In a real-world scenario, these would be consumed from a cloud service provider like AWS S3.