export enum ReadingStatusCode {
    READING = 'READING',
    COMPLETED = 'COMPLETED',
    WANT_TO_READ = 'WANT_TO_READ',
    NONE = 'NONE'
  }
  
  export interface ReadingStatus {
    id: number;
    name: string;
    code: ReadingStatusCode;
  }  