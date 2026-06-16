import { ProjectStatus } from '@prisma/client';
export declare class UpdateProjectDto {
    name?: string;
    description?: string;
    status?: ProjectStatus;
    startDate?: string;
    endDate?: string;
}
