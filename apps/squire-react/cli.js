(function start() {
    const process = require('process')
    const spawn = require('child_process').spawn
    const cmd = process.argv[2]
    const fs = require('fs')

    if (cmd == "start") {
        try {

            console.log(`Starting Supabase...`)
            const proc = spawn(`npx`, [`supabase`, `start`])
            // , (stderr, stdout) => {
            //     if (stderr) {
            //         console.error(stderr)
            //     } else {
            //         console.log(stdout)
            //         
            //         console.log(new Date().toISOString());
            //         [...Array(10000)].forEach( function (item,index) {
            //             stream.write(index + "\n");
            //         });
            //         console.log(new Date().toISOString());
            //         stream.end();
            //     }
            // });
            const stream = fs.createWriteStream(".env.local", {flags:'a'});

            proc.stdout.on('data', (data) => {
                const line = data.toString()
                console.log(line)
                if (line.includes("API URL")) {
                    const url = line.split("API URL: ")[1]
                    stream.write(`SQUIRE_PUBLIC_SUPABASE_URL=${url}\n`)
                }
                if (line.includes("anon key")) {
                    const key = line.split("anon key: ")[2]
                    stream.write(`SQUIRE_ANON_SUPABASE_KEY=${key}\n`)
                }
            })

            proc.stdout.on('error', (err) => {
                throw(err)
            })

            proc.on('exit', (code) => {
                console.log(`Supabase exited with code ${code}`)
            })

        } catch (e) {
            console.error("Error starting Supabase: ")
            console.error(e)
            process.exit(1)
        }
    }
})()
