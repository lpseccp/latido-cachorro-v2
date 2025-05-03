// Verifica se o navegador suporta a API do microfone
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
  let analyser = audioContext.createAnalyser();
  let microphone;
  let stream;
  let audioPlayer = document.getElementById('audioPlayer');

  // Função para iniciar a detecção de som
  async function startDetection() {
    try {
      // Pede permissão para acessar o microfone
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyser);

      // Configura o analisador para trabalhar com frequência
      analyser.fftSize = 256;
      let bufferLength = analyser.frequencyBinCount;
      let dataArray = new Uint8Array(bufferLength);

      // Função para verificar o volume do som
      function checkSoundLevel() {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;

        // Soma os valores de volume
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }

        let average = sum / bufferLength;

        // Quando o volume passar de um certo nível, toca o MP3
        if (average > 100) {
          if (audioPlayer.paused) {
            audioPlayer.play();
          }
        }

        // Chama a função novamente
        requestAnimationFrame(checkSoundLevel);
      }

      // Inicia a detecção contínua do som
      checkSoundLevel();

    } catch (error) {
      console.error('Erro ao acessar o microfone: ', error);
    }
  }

  // Adiciona evento ao botão para começar a detecção
  document.getElementById('startButton').addEventListener('click', () => {
    startDetection();
    document.getElementById('startButton').disabled = true;  // Desabilita o botão após o início
  });
} else {
  alert('Seu navegador não suporta a detecção de som.');
}