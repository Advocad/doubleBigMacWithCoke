class Dbmeter {
  constructor(private stream: MediaStream) {
    this.ctx = new AudioContext();
    this.spe = this.ctx.createAnalyser();
    this.spe.smoothingTimeConstant = 0.8;
    this.spe.fftSize = 1024;

    this.bufferLength = this.spe.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.mediaStreamSource = this.ctx.createMediaStreamSource(this.stream);
    this.mediaStreamSource.connect(this.spe);
  }

  public bufferLength: number;
  public dataArray: Uint8Array;
  public ctx: AudioContext;
  public spe: AnalyserNode;
  public mediaStreamSource: MediaStreamAudioSourceNode;

  public dbHandler: ((db: number) => void) | null = null;
  public isRun = false;

  public setDbHandler = (handler: (db: number) => void) => {
    this.dbHandler = handler;
  };

  public run = () => {
    if (!this.isRun) return;

    requestAnimationFrame(this.run);

    this.spe.getByteFrequencyData(this.dataArray);
    const sum = this.dataArray.reduce((prev, cur) => prev + cur, 0) / this.dataArray.length;
    // console.log('Db', sum);
    this.dbHandler && this.dbHandler(sum);
  };

  public setRun = (run: boolean) => {
    this.isRun = run;
  };
}

export { Dbmeter };
