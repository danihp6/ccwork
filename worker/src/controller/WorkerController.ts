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
            const container = await this.docker.createContainer({
                Image: message.dockerImage,
            });

            await container.start();
            console.log(`Container ${container.id} started`);

            const stream = await container.attach({ stream: true, stdout: true, stderr: true });
            stream.pipe(process.stdout);

            await container.wait();
            console.log(`Container ${container.id} finished`);
        } catch (error) {
            console.error('Error running container:', error);
        }
    }
}

export default WorkerController;