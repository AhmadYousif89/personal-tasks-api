export declare class TaskDto {
    title: string;
    details: string;
    status: 'Todo' | 'InProgress' | 'Completed';
    priority: 'Normal' | 'High';
    expireDate: string;
}
