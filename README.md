## Server
The backend application for CG controller and renderer, which has following functionalities:
1. Using [socket.io](https://socket.io/) for interaction between controllers and renderers.
2. REST API of 
    - Project Management
    - Overlay Management
    - Up / Down Overlay
    - ...
3. Receive RTMP live stream, mixed with CG renderer output, and output RTMP live stream, previewed by WebRTC,
Use [AliCloud ApsaraVideo Live](https://www.aliyun.com/product/live?spm=5176.19720258.J_8058803260.36.3e0d2c4a083jLg)

### Entities diagram
![entities](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/MyRenderer/server/master/architecture/entities.puml)

### Interaction flow
![interaction](https://raw.githubusercontent.com/MyRenderer/server/master/architecture/interaction.png)

### REST API
[Server REST API](https://app.swaggerhub.com/apis-docs/dream83619/MyRenderer/0.1)

### WebSocket Messages
1. **overlayUp**
    ```
    type: 'overlayUp';
    data: {
        overlay: {
            id: string;
            name: string;
            templateId: string;
            properties: object;
            status: 'up';
        }
    }
    ```
2. **overlayDown**
    ```
    type: 'overlayDown';
    data: {
        overlay: {
            id: string;
            name: string;
            templateId: string;
            properties: object;
            status: 'down';
        }
    }
    ```
3. **overlayUpdate**
    ```
    type: 'overlayUpdate';
    data: {
        overlay: {
            id: string;
            name: string;
            templateId: string;
            properties: object;
            status: 'up' | 'down';
        }
    }
    ```

### Local Development
1. npm i 
2. npm run dev
