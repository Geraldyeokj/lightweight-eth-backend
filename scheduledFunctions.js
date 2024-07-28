const CronJob = require('cron').CronJob;
const { spawn } = require('child_process');
const path = require('node:path'); 


exports.initScheduledJobs = () => {
    console.log("CRON JOBS ACTIVATED");
    
    const yhatUpdates = new CronJob("*/10 * * * *", async () => {
        try{
            console.log('CRON JOB: Updating Yhat | Called every 3 minutes ----------------------------------');
            console.log("current directory:", __dirname)
            console.log({
                level: 'verbose',
                message: 'CRON JOB: Updating Yhat | Called every 3 minutes'
            });

            const python = spawn('python3', ["./pythonstuff/yhat_gen_5.py"], {
                cwd: path.resolve(__dirname, "./")
            });

            setTimeout(() => {
                python.kill()
                console.log({
                    level: 'warn',
                    message: 'Killed Yhat updating process. Took more than 9 minutes.'
                });
                console.log('Killed Yhat updating process. Took more than 9 minutes.');
            }, 9 * 60 * 1000, "Yhat child process took too long")

            python.stdout.on('data', (data) => {
                console.log({
                    level: 'verbose',
                    message: data.toString()
                });
                console.log('python prints: ', data.toString());
            });
            
            python.stderr.on('data', (data) => {
                console.log({
                    level: 'error',
                    message: data.toString()
                });
                console.error('error: ', data.toString());
            });
            
            python.on('error', (error) => {
                console.log({
                    level: 'error',
                    message: error
                });
                console.error('error: ', error.message);
            });
            
            python.on('close', (code) => {
                console.log({
                    level: 'verbose',
                    message: `child process exited with code  ${code}`
                });
                console.log('child process exited with code ', code);
            });
            console.log("finished generating yhat graph")
        } catch (err) {
            console.log({
                level: 'error',
                message: err
            });
            console.warn(`Failed to generate yhat. Error: ${err}`)
        }
    });

    const gasPriceUpdates = new CronJob("15 * * * * *", async () => {
        try {
            console.log('CRON JOB: Updating Gas Prices | Called every minute (at the 15 second mark) ------------------');
            console.log("current directory:", __dirname)
            console.log("calling python program from", path.resolve(__dirname, "../../../"))
            console.log({
                level: 'verbose',
                message: 'CRON JOB: Updating Gas Prices | Called every minute (at the 15 second mark)'
            });
            
            const process = spawn('python3', ["./pythonstuff/index2.py"], {
                cwd: path.resolve(__dirname, "./")
            });
            setTimeout(() => {
                process.kill()
                console.log({
                    level: 'warn',
                    message: 'Killed Gas Price updating process. Took more than 30 seconds.'
                });
                console.log('Killed Gas Price updating process. Took more than 30 seconds.');
            }, 30*1000, "Get gas price took too long")

            process.stdout.on('data', (data) => {
                console.log({
                    level: 'verbose',
                    message: data.toString()
                });
                console.log('python prints: ', data.toString());
            });
            
            process.stderr.on('data', (data) => {
                console.log({
                    level: 'error',
                    message: data.toString()
                });
                console.error('error: ', data.toString());
            });
            
            process.on('error', (error) => {
                console.log({
                    level: 'error',
                    message: error
                });
                console.error('error: ', error.message);
            });
            
            process.on('close', (code) => {
                console.log({
                    level: 'verbose',
                    message: `child process exited with code  ${code}`
                });
                console.log('child process exited with code ', code);
            });
            console.log("finished getting gas price")
        } catch (err) {
            console.log({
                level: 'error',
                message: err
            });
            console.warn(`Failed to get gas price. Error: ${err}`)
        }
    });

  yhatUpdates.start();
  gasPriceUpdates.start();
}