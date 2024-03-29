$(document).ready(function(){
    colorsCSS();
    let nameOf = ["Mr. Detzner", "Ms. Harding"];

    let savedLessons = MP4.sort(function(a, b) {return a.week - b.week});;

    const lessonInfo = new URLSearchParams(window.location.search);
    grade = lessonInfo.get("grade");
    teacher = lessonInfo.get("teacher");

    $("#menu").append()

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
    if (grade=="fun") {
        lesson = allLessons[0]
        $("#pencil").remove();
    };
    lesson.display(grade, teacher);

    $("#menu").on("click", "button.menu", function(e){
        e.stopImmediatePropagation();
        lesson = $(this).blur().data("lesson").display(grade, teacher);
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
        e.preventDefault();
        e.clipboardData.setData('text/plain', emailMessage(lesson.quizName, lesson.quizLinks[grade][teacher], nameOf[teacher]));
        window.open('https://mcpsmd.instructure.com/conversations#filter=type=inbox', '_blank');
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
    this.button.addClass("w" + this.week);
    $("#menubuttons").append(this.button);

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
            part.htmlDisplay.html(lesson.quizLink(grade, teacher));
        }
        $("#lessonarea").append(part.display);
    });
    $("button.sel").removeClass("sel");
    lesson.button.addClass("sel");
    if (grade!="fun"){
        $("#pencil").attr("href", this.quizLinks[grade][teacher])
                    .attr("class", "w" + lesson.week);
    }
    return lesson;
}

Lesson.prototype.quizLink = function(grade, teacher){
    let link = make("a").attr("href", this.quizLinks[grade][teacher]).attr("target", "_blank");

    let frame = make("div.frame").html("<img src='images/quiz.png' style='width:auto'/><br>")
                    .append("Click the link to take this week's quiz:<br><span class='quizLink'>" + this.quizName + "</span>");

    return link.append(frame);
}

function emailMessage(quizName, quizLink, teacherName){

    return  "Hello,\r\nIf you haven't already, please make sure you take this week's quiz. It's called " + quizName + ". Here is the link:\r\n"+
    quizLink + 
    "\r\n\r\nRemember, you can take the quiz 2 times if you do not like your score!\r\n\r\n"+
    "Thanks,\r\n" + teacherName + 
    "\r\n\r\n--------------------------------------------------------------------------------\r\n\r\n" +
    "Hola,\r\nSi aún no lo ha hecho, por favor toma la prueba de esta semana. Se llama " + quizName + ". Aqui esta el link:\r\n"+
    quizLink + 
    "\r\n\r\nRecuerde, puede tomar la prueba 2 veces si no le gusta su calificacion!\r\n\r\n"+
    "Gracias,\r\n" + teacherName;

}