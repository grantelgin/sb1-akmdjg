import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface HurricaneRecord {
    name: string;
    date: string;
    lat: number;
    lon: number;
    windSpeed: number;
    category: number;
}

function getCategory(windSpeed: number): number {
    if (windSpeed >= 157) return 5;
    if (windSpeed >= 130) return 4;
    if (windSpeed >= 111) return 3;
    if (windSpeed >= 96) return 2;
    if (windSpeed >= 74) return 1;
    return 0;
}

function parseLatLon(value: string, direction: string): number {
    const numeric = parseFloat(value.slice(0, -1)) / 10.0;
    return direction === 'S' || direction === 'W' ? -numeric : numeric;
}

function parseHurdat2(content: string): HurricaneRecord[] {
    const lines = content.split('\n');
    const records: HurricaneRecord[] = [];
    let currentStorm: string | null = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (line.startsWith('AL') || line.startsWith('EP')) {
            // Header line
            const parts = line.split(',');
            currentStorm = parts[1].trim();
        } else {
            // Data line
            const parts = line.split(',').map(p => p.trim());
            
            // Only process records where the system is tropical (status 'HU')
            if (parts[3].trim() === 'HU') {
                const date = `${parts[0].slice(0,4)}-${parts[0].slice(4,6)}-${parts[0].slice(6,8)} ${parts[1].slice(0,2)}:${parts[1].slice(2,4)}:00+00`;
                const lat = parseLatLon(parts[4], parts[5]);
                const lon = parseLatLon(parts[6], parts[7]);
                const windSpeed = parseInt(parts[8]); // Already in knots

                records.push({
                    name: currentStorm!,
                    date,
                    lat,
                    lon,
                    windSpeed,
                    category: getCategory(windSpeed)
                });
            }
        }
    }

    return records;
}

function generateSQL(records: HurricaneRecord[]): string {
    let sql = '-- Generated from HURDAT2 dataset\n\n';
    sql += 'INSERT INTO hurricanes (name, date, lat, lon, wind_speed, category)\nVALUES\n';

    const values = records.map(record => 
        `  ('${record.name}', '${record.date}', ${record.lat}, ${record.lon}, ${record.windSpeed}, ${record.category})`
    );

    sql += values.join(',\n') + ';\n';
    return sql;
}

try {
    // Read HURDAT2 file
    // You'll need to download the file from: https://www.nhc.noaa.gov/data/hurdat/hurdat2-1851-2022-042723.txt
    const hurdat2Path = join(__dirname, 'hurdat2.txt');
    const content = readFileSync(hurdat2Path, 'utf-8');

    // Parse the content
    const records = parseHurdat2(content);
    console.log(`Parsed ${records.length} hurricane records`);

    // Generate and save SQL
    const sql = generateSQL(records);
    const outputPath = join(__dirname, 'seed_hurricanes_full.sql');
    writeFileSync(outputPath, sql);
    console.log(`Generated SQL file at ${outputPath}`);
} catch (error) {
    console.error('Error processing HURDAT2 file:', error);
} 