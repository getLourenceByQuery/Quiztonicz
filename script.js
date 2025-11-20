setTimeout(() => {
    $('.logo').hide();
    $('#menu').css('animation', 'menuEnter 0.8s ease-in-out');
    $('#menu').show();
},4700);

$(document).ready(function() {
    const speed = 250; 
    const overlay = $('#readmePop');

    const closeHandler = () => overlay.fadeOut(speed);
    
    $('#readme').on('click', () => {
        overlay.fadeIn(speed);
        $('.readmeTxt').show();
        $('.aboutTxt').hide();
    });

    $('#about').on('click', () => {
        overlay.fadeIn(speed);
        $('.readmeTxt').hide();
        $('.aboutTxt').show();
    });

    $('#close').on('click', closeHandler);
    
    overlay.on('click', function(e) {
        if (e.target === this) {
            closeHandler();
        }
    });

    $(document).on('keydown', (e) => {
        if (e.key === "Escape" || e.keyCode === 27) {
            if (overlay.is(':visible')) {
                closeHandler();
            }
        }
    });
});

$('#start').on('click', () => {
    $('#menu').css('animation', 'menuClose 0.8s ease-in-out');
    $('#menu').hide();
    $('#quizField').hide();
    $('#mainQuiz').show();
});

$(function(){
    const questionList = [
      { q:"What does HTML stand for?", c:["HyperText Markup Language","Hyper Trainer Marking Language","HighText Machine Learning"], a:0 },
      { q:"What does CSS control?", c:["Page styling","Server settings","Database management"], a:0 },
      { q:"Which tag creates a hyperlink?", c:["/a/","/link/","/href/"], a:0 },
      { q:"Which CSS property changes text color?", c:["color","text-style","font-color"], a:0 },
      { q:"Which symbol starts an ID selector in CSS?", c:["#",".","@"], a:0 },
      { q:"Which language adds interactivity to webpages?", c:["JavaScript","HTML","CSS"], a:0 },
      { q:"How do you write a JS alert?", c:["alert('Hi');","msg('Hi');","popup('Hi');"], a:0 },
      { q:"What is jQuery?", c:["A JavaScript library","A database engine","A CSS framework"], a:0 },
      { q:"Which symbol selects a class in jQuery?", c:["$('.class')","$('#class')","$('class')"], a:0 },
      { q:"How to hide an element in jQuery?", c:["$(el).hide()","$(el).none()","$(el).invisible()"], a:0 },
      { q:"Which CSS property sets background color?", c:["background-color","bg","color-bg"], a:0 },
      { q:"Which HTML tag inserts an image?", c:["/img/","/pic/","/image/"], a:0 },
      { q:"Which JS function logs output to console?", c:["console.log()","print()","echo()"], a:0 },
      { q:"How to fade an element in jQuery?", c:["$(el).fadeIn()","$(el).light()","$(el).showSlow()"], a:0 },
      { q:"Which CSS property controls text size?", c:["font-size","text-size","size-font"], a:0 }
    ];

    const answers = {};
    const totalQuestions = questionList.length;

    questionList.forEach((item, i) => {
      const currentIdx = i + 1; 
      
      const choicesHTML = item.c.map((choiceText, choiceIndex) => {
        return `<div class="choice" data-choice='${choiceIndex}'>${choiceText}</div>`;
      }).join("");

      const getQuestionClasses = (idx) => {
        let classes = 'question';
        if (idx !== 1) classes += ' hidden'; 
        if (idx === 2) classes += ' blurred'; 
        return classes;

      };
      
      const questionHTML = `
        <div class='${getQuestionClasses(currentIdx)}' 
             id='q${currentIdx}' 
             data-index='${currentIdx}'>
          
          <div class='q-meta'>Question ${currentIdx} of ${totalQuestions}</div>
          <div class='q-text'>${item.q}</div>
          <div class='choices'>${choicesHTML}</div>
          <div class='controls'></div>
        </div>
      `;

      $("#questionsContainer").append(questionHTML);
    });

    function startQuiz() {
        $('#startScreen').fadeOut(300, function() {
            $questionsContainer.empty().show();

            questionList.forEach((item, i) => {
              const currentIdx = i + 1; 
              
              const choicesHTML = item.c.map((choiceText, choiceIndex) => {
                return `<div class="choice" data-choice='${choiceIndex}'>${choiceText}</div>`;
              }).join("");

              const getQuestionClasses = (idx) => {
                let classes = 'question';
                if (idx !== 1) classes += ' hidden'; 
                if (idx === 2) classes += ' blurred'; 
                return classes;
              };
              
              const questionHTML = `
                <div class='${getQuestionClasses(currentIdx)}' 
                    id='q${currentIdx}' 
                    data-index='${currentIdx}'
                    style='display: none;'> <div class='q-meta'>Question ${currentIdx} of ${totalQuestions}</div>
                  <div class='q-text'>${item.q}</div>
                  <div class='choices'>${choicesHTML}</div>
                  <div class='controls'></div>
                </div>
              `;

              $questionsContainer.append(questionHTML);
            });
            
            showQuestion(1);
        });
    }

    $(document).on('click','#startButton', startQuiz);

    $(document).on('click','.choice',function(){
      const $c = $(this);
      const $q = $c.closest('.question');

      $q.find('.choice').removeClass('selected');
      $c.addClass('selected');

      let current = $q.data('index');
      answers[current] = parseInt($c.data('choice'));

      setTimeout(()=>{
        if(current < totalQuestions){
          showQuestion(current + 1);
        } else {
          finishQuiz();
        }
      }, 300);
    });

    function showQuestion(n) {
      for (let i = 1; i <= totalQuestions; i++) {
        const $question = $(`#q${i}`);
        
        $question.removeClass('blurred').removeClass('hidden').hide(); 

        if (i === n) {
          $question.show();
          
        } else if (i === n - 1) {
          $question.show().addClass('blurred');

        } else if (i === n + 1) {
          $question.show().addClass('blurred');
          
        } else {
           $question.hide();
        }
      }
      
      $(`#q${n}`).fadeIn(200);
      
      $(`#q${n-1}`).fadeIn(200); 
      $(`#q${n+1}`).fadeIn(200); 
    }

    function finishQuiz(){
      let score = 0;
      let reviewHTML = ""; 

      questionList.forEach((q,i)=>{
        const qIdx = i + 1;
        const selectedChoiceIndex = answers[qIdx];
        const correctChoiceIndex = q.a;
        
        if(selectedChoiceIndex === correctChoiceIndex) {
            score++;
            reviewHTML += `<div id='tamaContainer' class='kontinir'>${qIdx}: <span style='color:green' id='tama'>Correct!</span> (${q.c[selectedChoiceIndex]})</div>`;
        } else {
            const userSelectionText = selectedChoiceIndex === undefined ? "No Answer" : q.c[selectedChoiceIndex];
            const correctText = q.c[correctChoiceIndex];
            reviewHTML += `<div id='maliContainer' class='kontinir'>${qIdx}: <span style='color:red' id='mali'>Wrong!</span> Your answer: ${userSelectionText}. Correct answer: ${correctText}</div>`;
        }
      });

      $(".question").fadeOut(3000, function() {
        $('#resultArea').html(`
          <div class='result'>
            <h2 id='yourScore'>Your Score: ${score} / ${totalQuestions}</h2>
            
            <div class='review-details'>
                ${reviewHTML}
            </div>
            
          </div>
        <button class='btn' id='retry';'><p>X</p></button>

        `).fadeIn(400); 
      });
    }

    $(document).on('click','#retry',function(){ location.reload(); });

    showQuestion(1);

});