const PLUS = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>';
const X = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

$(document).ready(function(){

    let lesson = new Lesson ("Basketball 3", "1", "3", "3-5");
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
        let activity = new Part (button.data("name"), button.data("type"));
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
        console.log(input.val());
        part.displayTitle.html(input.val());
    });

    $("#lessonarea").on("keyup", "textarea", function(e){
        e.stopImmediatePropagation();
        let input = $(this);
        let part = input.data("part");
        console.log(input.val());
        part.htmlDisplay.html(input.val());
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

function Lesson (name, mp, week, grade) {
    this.name = name;
    this.mp = mp;
    this.week = week;
    this.grade = grade;
    this.parts = [];

    this.parts.push(new Part("WARM UP!", "warmup"));
    this.parts.push(new Part("Introduction", "intro"));
    this.parts.push(new Part("Objectives", "objectives"));
}

Lesson.prototype.edit = function(){
    let lesson = this;
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

function Part (name, type) {
    this.name = name;
    this.type = type;
    this.html = "";
    this.nameInput = make("input")
                    .attr("value",name)
                    .data("part", this);
    this.deleteButton = make("button.delete")
                    .html(X)
                    .data("part", this);
    this.htmlInput = make("textarea")
                    .attr("value","")
                    .data("part", this);
    this.el = make("div.panel." + type)
                .append(this.nameInput)
                .append(this.deleteButton)
                .append(this.htmlInput);
                this.el = this.el.add(this.addButton("Activity", "activity"));
                this.el = this.el.add(this.addButton("Cues", "cues"));
                this.el = this.el.add(this.addButton("Quiz", "quiz"));
    
    this.htmlDisplay = make("div.frame").html(this.html);
    this.displayTitle = make("span").html(this.name);
    this.display = make("div.panel." + type)
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
function make(el) {
    let split1 = el.split(/[#]/);
    let elementSplit = split1[0];
    let element = elementSplit.split(/[.]/)[0];
    let css = parseClasses(elementSplit);

    let $el = $(document.createElement(element))
                .attr("class", css);

    if (split1.length > 1){

        let idSplit = split1[1];
        let id = idSplit.split(/[.]/)[0];
        css += " " + parseClasses(idSplit);

        $el.attr("id", id).attr("class", css);
    }

    return $el;
}

function parseClasses(str){
    let classes = str.split(/[.]/);
    let css = "";
    if (classes.length > 1) {
        css = classes[1];
        for (let i = 2; i < classes.length; i++){
            css += " " + classes[i];
        }
    }
    return css;
}

function saveText(text, filename){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click();
}