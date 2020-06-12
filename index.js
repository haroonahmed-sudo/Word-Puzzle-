const stepWizard = document.querySelector('.stepwizard-row');
const mainform = document.querySelector('#mainForm');
var btn = '';
var counter = 1;

db.collection('Puzzle').get().then(snapshot =>{
    const questionsCount = snapshot.length;//Gives us number of questions
    console.log(snapshot);
    console.log(questionsCount);
    var wzrdSteps = '';
    var formData = '';
    var PuzzleAnswer = '';
    snapshot.forEach(docs => {
        var puzleArray = docs.data().Question.split("");
        PuzzleAnswer = docs.data().Answer.trim().toLowerCase();

    
        if(counter == 1)
        {
            wzrdSteps = wzrdSteps + `
            <div class="stepwizard-step col-xs-3">
                <a href="#step-${counter}" type="button" class="btn btn-success btn-circle"  >${counter }</a>
            </div>
            `
        }
        else
        {
            wzrdSteps = wzrdSteps + `
            <div class="stepwizard-step col-xs-3">
                <a href="#step-${counter}" type="button" class="btn btn-circle" >${counter}</a>
            </div>
            `;
        }

   
        formData = formData + `
        <div class="panel panel-primary setup-content"   id="step-${counter}">
            <div class="panel-heading mt-5">
                <h3 class="panel-title"><i class="fa fa-tint" aria-hidden="true" title="Hint" ></i> ${docs.data().Hint}</h3>
                <h3 class="panel-title" style="float:right;color:red;">${docs.data().Question}</h3>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <!--<label class="control-label">Arange Puzzle</label>-->
                    <input maxlength="100" type="text" required="required" class="form-control textclass" id="txtInput" placeholder="Enter puzzle words" />
                </div>
                <div class="form-group puzzleButtons" id="puzzleButtons-${counter}">
                    ${
                        puzleArray.map(function(key){
                            return `<button class="btn btn-success mr-1 dynamicButtons">${key}</button>`;
                        }).join(" ")
                    }
                    ${ 
                        makeButtonsHtml(counter,questionsCount)
                    }
                </div>
            </div>
        </div>
        `;
        counter++;
    });
    
    stepWizard.innerHTML = wzrdSteps;
    mainform.innerHTML = formData ;
    function makeButtonsHtml(counter,questionsCount)
    {
        if(counter ==  30)
            return `<button class="btn btn-primary nextBtn pull-right mt-5" type="button" style="float:right;" id=${PuzzleAnswer}>Finish</button>`

            return `<button class="btn btn-primary nextBtn pull-right mt-5" tbutton" style="float:right;" id=${PuzzleAnswer}>Next</button>`
    }

});





//Below Jquery code is for the bootstrap panels we generated dynamically  
$(document).ready(function () {
    setTimeout(function() {
        var navListItems = $('div.setup-panel div a'),
        allWells = $('.setup-content'),
        allNextBtn = $('.nextBtn');
        allWells.hide();

        navListItems.click(function (e) {
            e.preventDefault();
            var $target = $($(this).attr('href')),
                $item = $(this);
        
            if (!$item.hasClass('disabled')) 
            {
                navListItems.removeClass('btn-success').addClass('btn-default');
                $item.addClass('btn-success');
                allWells.hide();
                $target.show();
                $target.find('input:eq(0)').focus();
            }
        });
    
        allNextBtn.click(function (e) {
            var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            curInputs = curStep.find("input[type='text'],input[type='url']"),
            isValid = true;
            curInputValue = curStep.find("input[type='text']").val().toLowerCase().trim();
            curButtons = $(this).closest(".dynamicButtons")
            $(".form-control").removeClass("is-invalid");
            for (var i = 0; i < curInputs.length; i++) {
                if (!curInputs[i].validity.valid) {
                    isValid = false;
                    $(curInputs[i]).closest(".form-control").addClass("is-invalid");
                }
            }
            if (isValid) 
            {
                var curInputValueinteger = parseInt(curInputValue.length, 10);
                var Answerinteger = parseInt(e.target.id.trim().length, 10);
                if(curInputValueinteger < Answerinteger)
                {
                    document.getElementById('divMessage').style.display="block";
                    $('#pMessage').text("Less than the required Puzzle word");
                    $('#divMessage').delay(3000).fadeOut('slow');
                }
                    
                else if(curInputValueinteger > Answerinteger)
                {
                    document.getElementById('divMessage').style.display="block";
                    $('#pMessage').text("Exceeded the Puzzle word");
                    $('#divMessage').delay(3000).fadeOut('slow');
                }
                    
                else
                    {
                        if(curInputValue == e.target.id.trim() )
                        {
                            document.getElementById('divMessage').style.display="block";
                            $('#pMessage').text("Wow , thats Correct");
                            $('#divMessage').delay(3000).fadeOut('slow');
                            nextStepWizard.removeAttr('disabled').trigger('click');
                            $("#txtInput").val(null);
                        }
                        else
                        {
                            document.getElementById('divMessage').style.display="block";
                            $('#pMessage').text("In-Correct");
                            $('#divMessage').delay(3000).fadeOut('slow');
                        }
                    }
            }
           
        });
        $('div.setup-panel div a.btn-success').trigger('click');

        $('.dynamicButtons').click(function(event){
            event.preventDefault();
            var data = $('.textclass').val();
            $('.textclass').val(data + event.target.innerText);
        });
    }, 1000);
});