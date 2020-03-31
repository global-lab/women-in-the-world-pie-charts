let margin = 5;
let cats = ['Health', 'Business', 'Education'];


window.onload = function () {
    // window.addEventListener("resize", onWindowResize());
    d3.csv('data/data-other.csv').then(d => {
        let cat_dict = {};
        for (let cat of cats) {
            //find sub categories for each of our categories
            let sub_categories = d.filter(e => e.Category === cat).map(e => e.Sub_Category);
            // only get the unique ones
            let sub_cat_unique = [...new Set(sub_categories)];
            cat_dict[cat] = {};
            for (let sc of sub_cat_unique) {
                cat_dict[cat][sc] = sub_categories.filter(s => s === sc).length
            }
        }
        console.log(cat_dict);
        for (let cat of cats) {
            make_pie(cat, cat_dict[cat])
        }
    });
    $(window).on('resize', handleResize)

};

function make_pie(cat, data) {
    let width = document.getElementById('viz-' + cat).clientWidth;
    // let height = window.innerHeight;
    let height = width;
    let radius = (Math.min(width, height) / 2) - margin;
    let sum = Object.values(data).reduce((a, b) => a + b, 0); //total number of iqps in this category

    let svg = d3.select("#viz-" + cat)
        .append("svg")
        .attr('class', 'svg-' + cat)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate( 0, " + (radius + 5) + ")");


    let color = d3.scaleSequential(d3.interpolateCool);


    let pie = d3.pie()
        .value(d => d.value);


    let data_ready = pie(d3.entries(data));

    let arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    svg
        .selectAll('.viz-' + cat)
        .data(data_ready)
        .enter()
        .append('path')
        .attr('class', 'path-' + cat)
        .attr('d', arcGenerator)
        .attr('fill', d => color(1.4 * d.data.value / sum))
        .attr("stroke", "black")
        .style("stroke-width", "1px")
        .style("opacity", 0.8)
        .attr("transform", "translate(" + width / 2 + ", 0 )");

    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
        .selectAll('.viz-' + cat)
        .data(data_ready)
        .enter()
        .append('text')
        .text(function (d) {
            return d.data.key + " (" + d.data.value + ")"
        })
        .attr("transform", function (d) {
            let centroid = arcGenerator.centroid(d)
            return "translate(" + ((width / 2) + centroid[0]) + "," + centroid[1] + ")";
        })
        // .attr("transform", "translate(" + width / 2 + ", 0 )")
        .style("text-anchor", "middle")
        .style("font-size", '1.1em')
}

function handleResize() {

    for (let cat of cats) {
        console.log('resize called for cat', cat);

        let width = document.getElementById('viz-' + cat).clientWidth;
        let height = document.getElementById('viz-' + cat).clientHeight;
        //     let height = width

        console.log('width, height', width, height);
        console.log('min', Math.min(width, height));
        let radius = (Math.min(width, height) / 2) - margin;

        d3.selectAll('.svg-' + cat)
            .attr("width", width)
            .attr("height", height)
            .append("g");

        let arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        d3.selectAll('.path-' + cat)
            .attr('d', arcGenerator)
            .attr("transform", "translate(" + width / 2 + ", 0 )");


        d3.selectAll('text')
            .attr("transform", function (d) {
                let centroid = arcGenerator.centroid(d);
                return "translate(" + ((width / 2) + centroid[0]) + "," + centroid[1] + ")";
            })
            .style("text-anchor", "middle")

    }
}


