/**
 * Minimal RFC-4180 CSV parser — quoted fields, "" escapes, CR/LF/CRLF.
 * Hand-rolled to keep the Workers bundle free of a CSV dependency;
 * the only CSV we parse is the mentor-import template we ship ourselves.
 */

export function parseCsv(text: string): string[][] {
    const rows: string[][] = []
    let row: string[] = []
    let field = ""
    let inQuotes = false
    let i = 0

    const pushField = (): void => {
        row.push(field)
        field = ""
    }
    const pushRow = (): void => {
        pushField()
        rows.push(row)
        row = []
    }

    while (i < text.length) {
        const char = text[i]

        if (inQuotes) {
            if (char === '"') {
                if (text[i + 1] === '"') {
                    field += '"'
                    i += 2
                } else {
                    inQuotes = false
                    i++
                }
            } else {
                field += char
                i++
            }
            continue
        }

        if (char === '"' && field === "") {
            inQuotes = true
            i++
        } else if (char === ",") {
            pushField()
            i++
        } else if (char === "\r") {
            if (text[i + 1] === "\n") i++
            pushRow()
            i++
        } else if (char === "\n") {
            pushRow()
            i++
        } else {
            field += char
            i++
        }
    }

    // Final field/row unless the file ended on a newline
    if (field !== "" || row.length > 0) {
        pushRow()
    }

    return rows
}

export interface CsvRecords {
    headers: string[]
    rows: Record<string, string>[]
}

/**
 * Parse CSV text into header-keyed records. Headers are lowercased and
 * trimmed; fully empty rows are dropped.
 */
export function csvRecords(text: string): CsvRecords {
    const raw = parseCsv(text)
    if (raw.length === 0) return { headers: [], rows: [] }

    const headers = raw[0].map((h) => h.trim().toLowerCase())
    const rows: Record<string, string>[] = []

    for (const cells of raw.slice(1)) {
        if (cells.every((c) => c.trim() === "")) continue
        const record: Record<string, string> = {}
        headers.forEach((header, idx) => {
            record[header] = (cells[idx] ?? "").trim()
        })
        rows.push(record)
    }

    return { headers, rows }
}
