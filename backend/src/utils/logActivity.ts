import ActivityLog from '../models/ActivityLog'

export async function logActivity({project,user,action,details}:
    {
        project:string;
        user:string;
        action:string;
        details?:string;
    })
{
    await ActivityLog.create({ project,user,action,details});
}