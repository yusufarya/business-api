export class Helper {
    static dateTimeLocal(date : Date) {
        const utcTime = date.getTime();

        // Jakarta time zone offset in milliseconds (7 hours ahead of UTC)
        const jakartaOffset = 7 * 60 * 60 * 1000;

        // Convert the UTC time to Jakarta time
        const jakartaTime = utcTime + jakartaOffset;

        // Create a new Date object representing the Jakarta time
        const jakartaDate = new Date(jakartaTime);

        return jakartaDate
    }
}