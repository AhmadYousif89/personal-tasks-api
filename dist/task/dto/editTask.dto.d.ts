export declare class EditTaskDto {
    title: string;
    details: string;
    status: 'Todo' | 'InProgress' | 'Completed';
    priority: 'Normal' | 'High';
    isExpired: boolean;
}
