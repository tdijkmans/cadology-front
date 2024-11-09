

export function durationToSeconds(duration: string): number {
    // Regular expression to match "minutes:seconds.milliseconds" or "seconds.milliseconds"
    const regex = /^(\d+):(\d{1,2})\.(\d{1,3})$|^(\d+)\.(\d{1,3})$/;
    const match = duration.match(regex);

    if (!match) {
        throw new Error("Invalid duration format");
    }

    if (match[1]) {
        // Case with minutes and seconds (e.g., "1:10.360")
        const minutes = Number.parseInt(match[1], 10);
        const seconds = Number.parseInt(match[2], 10);
        const milliseconds = Number.parseInt(match[3], 10);

        return minutes * 60 + seconds + milliseconds / 1000;
    }
    if (match[4]) {
        // Case with only seconds and milliseconds (e.g., "10.360")
        const seconds = Number.parseInt(match[4], 10);
        const milliseconds = Number.parseInt(match[5], 10);

        return seconds + milliseconds / 1000;
    }
    throw new Error("Unexpected error in parsing");
}