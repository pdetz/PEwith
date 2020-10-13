$(document).ready(function(){

    let lesson = new Lesson(LESSONS[LESSONS.length - 1]);
    lesson.display($("#lessonarea"));

});

function Lesson (saved) {
    this.name = saved.name;
    this.mp = saved.mp;
    this.week = saved.week;
    this.grade = saved.grade;
    this.parts = [];

    saved.parts.forEach(part =>{
        this.parts.push(new Part(part));
    });
}

function Part (part){
    this.htmlDisplay = make("div.frame").html(part.html);
    this.displayTitle = make("span").html(part.name);
    this.display = make("div.panel." + part.type)
                    .append(this.displayTitle)
                    .append(this.htmlDisplay);
}

Lesson.prototype.display = function(area) {
    let lesson = this;
    area.children().detach();
    lesson.parts.forEach(part => {
        area.append(part.display);
    });
}