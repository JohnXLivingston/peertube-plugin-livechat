class Logger {
  public debug (s: string): void {
    console.log(s)
  }

  public info (s: string): void {
    console.info(s)
  }

  public warn (s: string): void {
    console.warn(s)
  }

  public error (s: string): void {
    console.error(s)
  }
}

const logger = new Logger()

export {
  logger
}
