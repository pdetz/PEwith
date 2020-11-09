$(document).ready(function(){
    let savedLessons = MP2;

    const lessonInfo = new URLSearchParams(window.location.search);
    grade = lessonInfo.get("grade");
    teacher = lessonInfo.get("teacher");

    let allLessons = [];
    savedLessons.forEach(savedLesson => {
        if (savedLesson.grade.includes(grade.toString()) && savedLesson.published){
            let newLesson = new Lesson(savedLesson);
            allLessons.push(newLesson);
        }
    });

    let lesson = allLessons[allLessons.length - 1];
    lesson.display(grade, teacher);

    $("#menu").on("click", "button.menu", function(e){
        e.stopImmediatePropagation();
        $(this).blur().data("lesson").display(grade, teacher);
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
    this.displayTitle = make("span").html(part.name);
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
}

Lesson.prototype.quizLink = function(grade, teacher){
    return "Click the following link to take this week's quiz:<br>" +
            "<a href='" + this.quizLinks[grade][teacher] + "' class='quizLink' target='blank'>" + this.quizName + "</a>";
}