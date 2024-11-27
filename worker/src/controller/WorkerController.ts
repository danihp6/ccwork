import Docker from 'dockerode';

import { QueueParameters } from '../common/types';

export class WorkerController {
    private static instance: WorkerController;
    private docker: Docker;

    public constructor() {
        this.docker = new Docker();
    }

    public static getInstance(): WorkerController {
        if (!WorkerController.instance) {
            WorkerController.instance = new WorkerController();
        }
        return WorkerController.instance;
    }

    public async process(message: QueueParameters): Promise<void> {
        try {
            console.log('Processing message:', message);

            // Create a promise that will be resolved on the onFinished method
            await new Promise<void>((resolve, reject) => {
                this.docker.pull(message.dockerImage, (err: any, stream: NodeJS.ReadableStream) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        return;
                    }

                    this.docker.modem.followProgress(stream, onFinished);
        
                    function onFinished(err: any, _: any) {
                        if (!err) {
                            console.log(`Image ${message.dockerImage} pulled`);
                            resolve();
                        } else {
                            console.log(err);
                            reject(err);
                        }
                    }
                });
            });

            const container = await this.docker.createContainer({
                Image: message.dockerImage,
                Entrypoint: [message.parameter],
            });

            const stream = await container.attach({ stream: true, stdout: true, stderr: true });
            stream.pipe(process.stdout);

            await container.start();
            console.log(`Container ${container.id} started`);
            console.log(`Running image ${message.dockerImage}`);


            // Wait for the container to finish
            await container.wait();
            console.log(`Container ${container.id} finished`);

            // Remove the container
            await container.remove();
            console.log(`Container ${container.id} removed`);
        } catch (error) {
            console.error('Error running container:', error);
        }
    }
}

export default WorkerController;