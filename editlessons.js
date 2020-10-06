$(document).ready(function(){

    /*Data from URL
    let grade = "3";
    let week = "5";
    let mp = "1";
    */

    let allLessons = [];

    LESSONS.forEach(lesson => {
        allLessons.push(new Lesson(lesson));
    });

    let lesson = allLessons[allLessons.length - 1];
    lesson.edit();
    lesson.display($("#displayarea"));

    $("#lessonarea").append(
        "<hr>",
        make("button.save").html("Save Lesson")
    );

    $("#lessonarea").on("click", "button.save", function(e){
        e.stopImmediatePropagation();
        let savedLesson = new SavedLesson(lesson);
        saveText( JSON.stringify(savedLesson), "lesson.json" );
    });

    $("#lessonarea").on("click", "button.new", function(e){
        e.stopImmediatePropagation();
        let button = $(this);
        let part = button.data("part");
        button.blur();
        let activity = newPart(button.data("name"), button.data("type"));
        part.el.last().after(activity.el);
        let index = lesson.parts.indexOf(part);
        lesson.parts.splice(index + 1,0, activity);
        
        lesson.display($("#displayarea"));
    });

    $("#lessonarea").on("click", "button.delete", function(e){
        e.stopImmediatePropagation();
        let button = $(this);
        let part = button.data("part");
        button.blur();
        let index = lesson.parts.indexOf(part);
        lesson.parts.splice(index,1);
        
        part.el.remove();
        lesson.display($("#displayarea"));
    });

    $("#lessonarea").on("keyup", "input", function(e){
        e.stopImmediatePropagation();
        let input = $(this);
        let part = input.data("part");
        let value = input.val();
        part.displayTitle.html(value);
        part.name = value;
    });
    
    $(".info").on("keyup", "input", function(e){
        e.stopImmediatePropagation();
        let input = $(this);
        let prop = input.data("prop");
        let lesson = input.closest("table").data("lesson");
        let value = input.val();
        lesson[prop] = value;
    });

    $("#lessonarea").on("keyup", "textarea", function(e){
        e.stopImmediatePropagation();
        let input = $(this);
        let part = input.data("part");
        let value = input.val();
        part.htmlDisplay.html(value);
        part.html = value;
    });
});

function SavedLesson(lesson) {
    this.name = lesson.name;
    this.mp = lesson.mp;
    this.week = lesson.week;
    this.grade = lesson.grade;
    this.parts = [];

    lesson.parts.forEach( function(part){
        let formattedPart = {
            "name": part.name,
            "type": part.type,
            "html": part.html
        };
        this.parts.push(formattedPart);
    }, this);
}

function newLesson (name, mp, week, grade) {

    let lesson = {"name": name, "mp": mp, "week": week, "grade": grade, parts: []};

    lesson.parts.push(newPart("WARM UP!", "warmup"));
    lesson.parts.push(newPart("Introduction", "intro"));
    lesson.parts.push(newPart("Objectives", "objectives"));
    lesson.parts.push(newPart("Quiz", "quiz"));

    return new Lesson(lesson);
}

function newPart(name, type) {
    let part = {"name": name, "type": type, "html": ""};
    return new Part(part);
}

function Lesson (saved) {
    this.name = saved.name;
    this.mp = saved.mp;
    this.week = saved.week;
    this.grade = saved.grade;
    this.parts = [];

    saved.parts.forEach(part =>{
        this.parts.push(new Part(part));
    });
    
    this.nameInput = make("input")
                    .attr("value",this.name)
                    .data("prop", "name");
    this.mpInput = make("input")
                    .attr("value",this.mp)
                    .data("prop", "mp");
    this.weekInput = make("input")
                    .attr("value",this.week)
                    .data("prop", "week");
    this.gradeInput = make("input")
                    .attr("value",this.grade)
                    .data("prop", "grade");

    this.info = make("table.info").data("lesson", this)
                .append(make("tbody")
                    .append(make("tr")
                        .append(make("td").append("Lesson Name: "))
                        .append(make("td").append(this.nameInput))
                        )
                    .append(make("tr")
                        .append(make("td").append("Marking Period: "))
                        .append(make("td").append(this.mpInput))
                        )
                    .append(make("tr")
                        .append(make("td").append("Week: "))
                        .append(make("td").append(this.weekInput))
                        )
                    .append(make("tr")
                        .append(make("td").append("Grade Levels: "))
                        .append(make("td").append(this.gradeInput))
                        ));
    
}

Lesson.prototype.edit = function(){
    let lesson = this;
    $("#lessonarea").append(lesson.info);
    lesson.parts.forEach(part =>{
        $("#lessonarea").append(part.el);
    });
}

Lesson.prototype.display = function(area) {
    let lesson = this;
    area.children().detach();
    lesson.parts.forEach(part => {
        area.append(part.display);
    });
}

function Part (savedPart) {
    this.name = savedPart.name;
    this.type = savedPart.type;
    this.html = savedPart.html;
    console.log(this.html);
    this.nameInput = make("input")
                    .attr("value",this.name)
                    .data("part", this);
    this.deleteButton = make("button.delete")
                    .html(X)
                    .data("part", this);
    this.htmlInput = make("textarea")
                    .val(this.html)
                    .data("part", this);
    this.el = make("div.panel." + this.type)
                .append(this.nameInput)
                .append(this.deleteButton)
                .append(this.htmlInput);
                this.el = this.el.add(this.addButton("Activity", "activity"));
                this.el = this.el.add(this.addButton("Cues", "cues"));
                this.el = this.el.add(this.addButton("Quiz", "quiz"));
                this.el = this.el.add(this.addButton("Objectives", "objectives"));
                this.el = this.el.add(this.addButton("Intro", "intro"));
                this.el = this.el.add(this.addButton("Warm Up", "warmup"));
    
    this.htmlDisplay = make("div.frame").html(this.html);
    this.displayTitle = make("span").html(this.name);
    this.display = make("div.panel." + this.type)
                    .append(this.displayTitle)
                    .append(this.htmlDisplay);
}

Part.prototype.addButton = function(name, type){
    let button = make("button.new." + type)
                    .append(PLUS)
                    .append(" " + name)
                    .data({"name": name,
                            "type": type,
                            "part": this
                    });
    return button;
}

///////////////////////////////////////////////////////////////////////


function saveText(text, filename){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click();
}