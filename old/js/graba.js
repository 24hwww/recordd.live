var URL = window.URL || window.webkitURL;
var recorder, chunks = [];
const recdata = window.localStorage.getItem("rdata") || false;
var audioContext = window.AudioContext || window.webkitAudioContext;
var rbtn = document.getElementById('recordButton');
var timeleftRecordd = document.getElementById('timeleftRecordd');
let timeleft = 10;
var gumStream = '';
var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
//var record = navigator.mediaDevices.getUserMedia({ audio: true, video: false });
let countdownTimer = '';

function CountdownTimer(props) {
  return <i>You have <strong>{props.cnumber}</strong> seconds.</i>;
}

function DateNow(){
const timeElapsed = Date.now();
const today = new Date(timeElapsed);
return <span>{today.toDateString()}</span>
}


function ListVoice(){
  return (<div >kajsas</div>);
}

class Reclive extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isButtonActive: false,
            rec: recdata !== false ? 1 : 0,
            btnLabel: recdata !== false ? 'Play' : 'Record/Stop',
            timeleft: timeleft,
            play: false,
            timel: 10,
            rdata: recdata,
            ifrec: props.ifrec,
        };
        this.audio = new Audio();
        this.audiofin = this.audiofin.bind(this);
        this.bytime = this.bytime.bind(this);

    }

    graba(au){
      console.log('enviar audio');

      $.ajax({
          url:"./graba.php",
          type:"POST",
          dataType:"json",
          data: {
            'audio': au,
          },
          success : function(result) {
              console.log(result);
          },
          error: function(err){
            console.log(err);
          }
      });

    }

    bytime(r,tl=10){
        return new Promise((resolve, reject) => {
          countdownTimer = setInterval(() => {
              tl--;

              this.setState({timel:tl});

              if (tl <= 0) {
                clearInterval(countdownTimer);
                resolve(true);
                if (recorder && recorder.state == "recording") {
                {this.stopRecording()}
                }
                console.log('termino la grabacion...');
              }

          }, 1000);
       });    
    }

    startRecording() {
      if(!getUserMedia) {
        console.warn("Let's get this party started")
      }

      if(this.state.rec !== 0){
        return false;
      }

      const grabacion = (au) => {
        this.setState({rdata: au,})
      }

      const sendgraba = (au) => {
        this.graba(au);
      }      

      this.setState({
          isButtonActive: !this.state.isButtonActive,
          rec: 0,
          btnLabel: 'Recording... / Stop',
      })
      navigator.mediaDevices.getUserMedia({audio: true}).then(function(stream) {
        gumStream = stream;
        recorder = new MediaRecorder(stream);

            recorder.ondataavailable = function(e) {

            chunks.push(e.data);
            const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            var reader = new FileReader();
            reader.readAsDataURL(blob); 

                reader.onloadend = function() {
                    localStorage.clear();
                    var audioBase64 = reader.result.toString();
                    let audioTurned = audioBase64.substr(audioBase64.indexOf(',')+1); 

                    var data = reader.result.split(";base64,")[1]; 
                    window.localStorage.setItem("rdata", audioTurned);
                    {grabacion(audioTurned)}
                    {sendgraba(audioTurned)}

                }

                /*var url = URL.createObjectURL(e.data);
                var preview = document.createElement('audio');
                preview.controls = true;
                preview.src = url;
                document.body.appendChild(preview);*/

            }
            recorder.start();

      }).catch(function(err) {
            console.warn(err);
            //rbtn.disabled = false;
      });
    }

    stopRecording(){
      recorder.stop();
      gumStream.getAudioTracks()[0].stop();
      this.setState({
          isButtonActive: !this.state.isButtonActive,
          rec: 1,
          btnLabel: 'Play',
          timel: 0
      });
      clearInterval(countdownTimer);
    }

    handleClick(){
        if (recorder && recorder.state == "recording") {
            {this.stopRecording()}
        }else{
            {this.startRecording()} 
            {this.bytime(recorder)}
        } 
    }

    audiofin(){
      console.log('detener');
      this.audio.currentTime = 0;  
      this.setState({play: 0, btnLabel: 'Play'});
    }

    playClick(){
      try{
        let rdata = recdata !== false ? recdata : this.state.rdata;
        let play = !this.state.play;
        var url = 'data:audio/webm;base64,'+rdata;
        
        this.audio.load();
        this.audio.src = url;

        if(play !== true){
          this.audio.pause();
          this.audio.currentTime = 0;  
          this.audio.remove();
          this.setState({play: false, btnLabel: 'Play'});
        }else{
          this.audio.play();
          this.setState({play: true, btnLabel: 'Stop'});
        }
        
        this.audio.onended = this.audiofin;
      }catch(error){
        console.warn(error);
      }
    }

    render() {

      const renderActionButton = () => {
        if (this.state.rec == 1){
          return <button id="playButton" className="btn btn-primary" onClick={() => this.playClick()}>{this.state.btnLabel}</button>;
        }else{
          return <button id="recordButton" className="btn btn-danger" onClick={() => this.handleClick()}>
          {this.state.btnLabel}
          </button>;
        }
      }

      return (
        <div class="recordd-main">
        <p><CountdownTimer cnumber={this.state.timel} /> {this.state.ifrec}</p>

        {renderActionButton()}

        </div>
      );
    }
}



/*class App extends React.Component {
    render(){
      return(
        <main class="height-100">
          <div class="container height-100">
            <div class="vertical-align height-100">
                <div id="center-recordd" class="col-md-8 col-sm-12 col-xs-12">
                    <h2>Record an audio and let them listen to you</h2>
                    <Reclive/>
                    <p id="formats"><strong>Last audio recorder:</strong> <DateNow/></p>
                </div>
            </div>
          </div>
        </main>
      )
    }
  }*/


const App = () => {
  const [currentLs, setCurrentLs] = React.useState('');

  React.useEffect(() => {
    window.addEventListener('storage', () => {
      const ls = recdata ? 1 : 0;
      console.log(ls);
      setCurrentLs(ls);
    })
  }, []);

  return (
          <main class="height-100"><div class="container height-100"><div class="vertical-align height-100"><div id="center-recordd" class="col-md-8 col-sm-12 col-xs-12"><h2>Record an audio and let them listen to you</h2><Reclive ifrec={currentLs}/><p id="formats"><strong>Last audio recorder:</strong> <DateNow/></p>
          
          <ListVoice/>
          
          </div></div></div></main>
  );
};

  
  ReactDOM.render(<App />, document.getElementById('root'));