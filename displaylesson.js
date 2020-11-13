$(document).ready(function(){
    let nameOf = ["Mr. Detzner", "Ms. Harding"];

    let savedLessons = MP2;

    const lessonInfo = new URLSearchParams(window.location.search);
    grade = lessonInfo.get("grade");
    teacher = lessonInfo.get("teacher");

    let allLessons = [];
    if (grade == "fun"){
        FUN.forEach(exercise => {
            let newLesson = new Lesson(exercise);
            allLessons.push(newLesson);
            newLesson.button.html(newLesson.week);
        });
    }
    else {
        savedLessons.forEach(savedLesson => {
            if (savedLesson.grade.includes(grade.toString()) && savedLesson.published){
                let newLesson = new Lesson(savedLesson);
                allLessons.push(newLesson);
            }
        });
    }

    let lesson = allLessons[allLessons.length - 1];
    if (grade=="fun") {lesson = allLessons[0]};
    lesson.display(grade, teacher);

    $("#menu").on("click", "button.menu", function(e){
        e.stopImmediatePropagation();
        $(this).blur().data("lesson").display(grade, teacher);
    });

    $("#lessonarea").on("click", "span.title", function(e){
        e.stopImmediatePropagation();
        $(this).next().slideToggle();
        console.log($(this).parent());
    });

    $("span.title").hover(
        function(e){
            e.stopImmediatePropagation();
            $(this).parent().addClass("dim");
        }, function(e) {
            e.stopImmediatePropagation();
            $(this).parent().removeClass("dim");

        }
    );

    document.addEventListener('copy', function(e) {
        // e.clipboardData is initially empty, but we can set it to the
        // data that we want copied onto the clipboard.
let email ="Hello,\r\nIf you haven't already, please make sure you take this week's quiz. It's called " + lesson.quizName + ". Here is the link:\r\n"+
            lesson.quizLinks[grade][teacher] + 
            "\r\n\r\nRemember, you can take the quiz 2 times if you do not like your score!\r\n\r\n"+
            "Thanks,\r\n" + nameOf[teacher] + 
            "\r\n\r\n--------------------------------------------------------------------------------\r\n\r\n" +
            "Hola,\r\nSi aún no lo ha hecho, por favor toma la prueba de esta semana. Se llama " + lesson.quizName + ". Aqui esta el link:\r\n"+
            lesson.quizLinks[grade][teacher] + 
            "\r\n\r\nRecuerde, puede tomar la prueba 2 veces si no le gusta su calificacion!\r\n\r\n"+
            "Gracias,\r\n" + nameOf[teacher];
        e.clipboardData.setData('text/plain', email);
        //e.clipboardData.setData('text/html', email);
      
        // This is necessary to prevent the current document selection from
        // being written to the clipboard.
        e.preventDefault();
        var tab = window.open('https://mcpsmd.instructure.com/conversations#filter=type=inbox', '_blank');
        if (tab) {
            tab.focus();
            $(tab.document.getElementById("compose-btn")).click();
        }
      });
});

function Lesson (saved) {
    this.name = saved.name;
    this.mp = saved.mp;
    this.week = saved.week;
    this.grade = saved.grade;
    this.parts = [];
    this.published = saved.published;
    this.quizName = saved.quizName;
    this.quizLinks = saved.quizLinks;
    this.grade = "";

    saved.parts.forEach(part =>{
        this.parts.push(new Part(part));
    });

    this.button = make("button.menu").html("Week " + this.week).data("lesson", this);
    $("#menu").append(this.button);

}

function Part (part){
    this.type = part.type;
    this.htmlDisplay = make("div.frame").html(part.html);
    this.displayTitle = make("span.title").html(part.name);
    this.display = make("div.panel." + part.type)
                    .append(this.displayTitle)
                    .append(this.htmlDisplay);
}

Lesson.prototype.display = function(grade,teacher) {
    let lesson = this;
    $("#lessonarea").children().detach();
    lesson.parts.forEach(part => {
        if (part.type=="quiz") {
            part.htmlDisplay.remove();
            part.display.html(lesson.quizLink(grade, teacher));
        }
        $("#lessonarea").append(part.display);
    });
    $("button.sel").removeClass("sel");
    lesson.button.addClass("sel");
}

Lesson.prototype.quizLink = function(grade, teacher){
    
    let link = make("a").attr("href", this.quizLinks[grade][teacher]).attr("target", "_blank");

    let frame = make("div.frame").html("<img src='images/quiz.png' style='width:auto'/><br>")
                    .append("Click the link to take this week's quiz:<br><span class='quizLink'>" + this.quizName + "</span>");

    return link.append(frame);
}