export interface ReminderType {
    imgPath: string;
    inceptionTime: number; // the time when first reminder was set
    timer: number; // time for which reminder was made
    acknowledged: boolean; // consider it synonymous to active
    reminderTime: number;
}