$(document).ready(function(){

    const lessonInfo = new URLSearchParams(window.location.search);
    source = lessonInfo.get("lessons");

    let lessons = MP2;
    if (source == "fun"){
        lessons = FUN;
    }

    let allLessons = [];

    lessons.forEach(savedLesson => {
        let newLesson = new Lesson(savedLesson);
        allLessons.push(newLesson);
    });

    let lesson = allLessons[allLessons.length - 1].switchTo();

    $("#saveadd").append(
        make("button.new").html(PLUS).append(" New")
    ).append(
        make("button.save").html("Save")
    );

    $("#lessons").on("click", "button.menu", function(e){
        e.stopImmediatePropagation();
        lesson = $(this).blur().data("lesson").switchTo();
    });

    $("#lessons").on("contextmenu", "button.menu", function(e){
        e.preventDefault();
        lesson = $(this).blur().toggleClass("published").data("lesson");
        lesson.published = !lesson.published;
    });

    $("#saveadd").on("click", "button.save", function(e){
        e.stopImmediatePropagation();
        $(this).blur;
        $("input").keyup();
        let saved = savedLessons(allLessons);
        saveText( "MP2 = " + JSON.stringify(saved) + ";", "lessonsmp2.js" );
    });
    $("#saveadd").on("click", "button.new", function(e){
        e.stopImmediatePropagation();
        $(this).blur;
        lesson = new Lesson(lessons[lessons.length - 1]);
        allLessons.push(lesson);
        lesson.switchTo();
    });

    $("#lessonarea").on("click", "button.new", function(e){
        e.stopImmediatePropagation();
        let button = $(this);
        let part = button.data("part");
        button.blur();
        let activity = newPart(button.data("name"), button.data("type"));

        if (activity.type == "quiz"){
            let quizLink = "Click the link to take " + lesson.quizLink() + ".";
            activity.htmlInput.remove();
            activity.htmlDisplay.html(quizLink);
        }

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
        
    $("#lessonarea").on("keyup", "input.info", function(e){
        e.stopImmediatePropagation();
        let input = $(this);
        let prop = input.data("prop");
        let lesson = input.closest("table").data("lesson");
        let value = input.val();
        lesson[prop] = value;
        lesson.button.html(lesson.grade + ": " + lesson.week);
        $("span.quizLink").html(lesson.quizName);

    });

    $("#lessonarea").on("keyup", "input.part", function(e){
        e.stopImmediatePropagation();
        let input = $(this);
        let part = input.data("part");
        let value = input.val();
        part.displayTitle.html(value);
        part.name = value;
    });

    $("#lessonarea").on("keyup", "textarea", function(e){
        e.stopImmediatePropagation();
        let input = $(this);
        let part = input.data("part");
        let value = input.val();
        part.htmlDisplay.html(value);
        part.html = value;
    });

    $("#lessonarea").on("keyup", "input.quiz", function(e){
        e.stopImmediatePropagation();
        let input = $(this);
        let grade = input.data("grade");
        let teacher = input.data("teacher");
        let lesson = input.closest("table").data("lesson");
        lesson.quizLinks[grade][teacher] = input.val();
    });
});

Lesson.prototype.switchTo = function(){
    let lesson = this;    
    lesson.edit();
    lesson.display($("#displayarea"));
    $("#lessons").find(".sel").removeClass("sel");
    lesson.button.addClass("sel");
    return lesson;
}

function savedLessons(lessons) {
    let lessonsArray = [];
    lessons.forEach(lesson=>{
        let saved = {
            "name": lesson.name,
            "mp": lesson.mp,
            "week": lesson.week,
            "grade": lesson.grade,
            "published": lesson.published,
            "quizLinks": lesson.quizLinks,
            "quizName": lesson.quizName,
            "parts": []
        };
    
        lesson.parts.forEach( function(part){
            let formattedPart = {
                "name": part.name,
                "type": part.type,
                "html": part.html
            };
            saved.parts.push(formattedPart);
        });
        lessonsArray.push(saved);
    });
    return lessonsArray;
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
    this.published = saved.published;
    this.quizName = saved.quizName;
    this.quizLinks = saved.quizLinks;
/*
    this.quizLinks = [];
    for (let grade = 0; grade < 6; grade++){
        let quizzes = ["D" + grade, "H" + grade];
        this.quizLinks.push(quizzes);
    }
    console.log(this.quizLinks);
*/
    saved.parts.forEach(part =>{
        this.parts.push(new Part(part));
    });

    this.nameInput = make("input.info")
                    .attr("value",this.name)
                    .data("prop", "name");
    this.mpInput = make("input.info")
                    .attr("value",this.mp)
                    .data("prop", "mp");
    this.weekInput = make("input.info")
                    .attr("value",this.week)
                    .data("prop", "week");
    this.gradeInput = make("input.info")
                    .attr("value",this.grade)
                    .data("prop", "grade");
    this.publishedInput = make("input.info")
                    .attr("value",this.published)
                    .data("prop", "published");
    this.quizNameInput = make("input#quizName.info")
                    .attr("value",this.quizName)
                    .data({"prop": "quizName","lesson":this});

    this.button = make("button.menu").html(this.grade + ": " + this.week).data("lesson", this);
    if (this.published) {
        this.button.addClass("published");
    }
    $("#lessons").append(this.button);

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

    this.quizTable = make("table.quizLinks").data("lesson", this)
                    .append(make("tbody")
                    .append(make("tr")
                        .append(make("td").append("Quiz: ").append(this.quizNameInput))
                        .append(make("td").append("Detzner"))
                        .append(make("td").append("Harding"))
                    ));
    for (let grade = 0; grade < 6; grade++){
        let tr = make("tr");
        tr.append(make("td").append("Grade " + grade));
        for (let teacher = 0; teacher < 2; teacher++){
            tr.append(make("td").append(this.quizLinkInput(grade,teacher)));
        }
        this.quizTable.find("tbody").append(tr);
    };
}

Lesson.prototype.quizLinkInput = function(grade, teacher){
    input = make("input.quiz")
                    .attr("value",this.quizLinks[grade][teacher])
                    .data({"grade": grade,
                            "teacher": teacher
                    });
    return input;
}

Lesson.prototype.edit = function(){
    let lesson = this;
    $("#lessonarea").children().detach();
    $("#lessonarea").append(lesson.info);
    $("#lessonarea").append(lesson.quizTable);
    lesson.parts.forEach(part =>{
        if (part.type == "quiz"){
            let quizLink = "Click the link to take " + lesson.quizLink() + ".";
            part.htmlInput.remove();
            part.htmlDisplay.html(quizLink);
        }
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

Lesson.prototype.menuButton = function(){
    let button = make("button.menu")
                    .data("lesson", this)
                    .html(this.week);
    return button;
}

Lesson.prototype.quizLink = function(){
    return "<span class='quizLink'>" + this.quizName + "</span>";
}

function Part (savedPart) {
    this.name = savedPart.name;
    this.type = savedPart.type;
    this.html = savedPart.html;
    
    this.nameInput = make("input.part")
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