EMERGENCYK2 = {"name":"Basketball 3","mp":"1","week":"3","grade":"3-5","parts":[{"name":"WARM UP!","type":"warmup","html":"<iframe width=\"640\" height=\"360\" src=\"https://www.youtube.com/embed/yV9z99gWjvY\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\n<iframe width=\"640\" height=\"360\" src=\"https://www.youtube.com/embed/uuNVz8KF7bc\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\n<iframe width=\"640\" height=\"360\" src=\"https://www.youtube.com/embed/hsfheb5UwdE\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>"},{"name":"Freeze Dance","type":"intro","html":"<iframe width=\"640\" height=\"360\" src=\"https://www.youtube.com/embed/ru0K8uYEZWw\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\n<iframe width=\"640\" height=\"360\" src=\"https://www.youtube.com/embed/yYPNrg-s-NI\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\n<iframe width=\"640\" height=\"360\" src=\"https://www.youtube.com/embed/efRmmFQ8QVA\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\n<iframe width=\"640\" height=\"360\" src=\"https://www.youtube.com/embed/ZbZSe6N_BXs\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>"},{"name":"Reading Time","type":"objectives","html":"<iframe width=\"640\" height=\"360\" src=\"https://www.youtube.com/embed/xcVvNVT3TtM\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe><iframe width=\"640\" height=\"360\" src=\"https://www.youtube.com/embed/fj_z6zGQVyM\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>"},{"name":"Cosmic Yoga","type":"activity","html":"<iframe width=\"640\" height=\"360\" src=\"https://www.youtube.com/embed/QM8NjfCfOg0\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>\n"}]};
$(document).ready(function(){

    let lesson = new Lesson(EMERGENCYK2);
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