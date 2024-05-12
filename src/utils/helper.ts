import { logger } from "../app/logging";

export class Helper {
    static dateTimeLocal(date: Date): Date {
        const utcTime = date.getTime();
        // Jakarta time zone offset in milliseconds (7 hours ahead of UTC)
        const jakartaOffset = 7 * 60 * 60 * 1000;
        // Convert the UTC time to Jakarta time
        const jakartaTime = utcTime + jakartaOffset;
        // Create a new Date object representing the Jakarta time
        const jakartaDate = new Date(jakartaTime);
        return jakartaDate;
    }

    static generateNoTransaction(): string {
        const currentDate = new Date();
        const year = currentDate.getFullYear(); // Get the year (e.g., 2024)
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Get the month (e.g., "01" for January)
        const date = currentDate.getDate().toString().padStart(2, '0'); // Get the date of the month (e.g., "08" for the 8th of May)
        logger.info("year = " + year);
        logger.info("month = " + month);
        logger.info("date = " + date);
        const result = `${year}${month}${date}`; // Concatenate the components into a single string
        return result;
    }
}
