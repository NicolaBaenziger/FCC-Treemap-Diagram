const URL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";

fetch(URL)
    .then(response => response.json())
    .then(data => {
        const width = 800;
        const height = 400;

        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const tooltip = d3.select("#tooltip");

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const treemap = d3.treemap()
            .size([width, height])
            .padding(1)
            .round(true);

        const root = d3.hierarchy(data)
            .sum(d => d.value);

        treemap(root);

        const cells = svg.selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        cells.append("rect")
            .attr("class", "tile")
            .attr("fill", d => colorScale(d.data.category))
            .attr("data-name", d => d.data.name)
            .attr("data-category", d => d.data.category)
            .attr("data-value", d => d.data.value)
            .attr("width", d => Math.max(0, d.x1 - d.x0))
            .attr("height", d => Math.max(0, d.y1 - d.y0))
            .on("mouseover", d => {
                tooltip.style("display", "block");
                tooltip.style("left", d3.event.pageX + 10 + "px");
                tooltip.style("top", d3.event.pageY - 10 + "px");
                tooltip.select("#tooltip-name").text(d.data.name);
                tooltip.select("#tooltip-category").text(d.data.category);
                tooltip.select("#tooltip-value").text(d.data.value);
                tooltip.attr("data-value", d => d.data.value);
            })
            .on("mouseout", () => {
                tooltip.style("display", "none");
            });

        const legend = d3.select("#legend");

        const categories = [...new Set(data.children.map(d => d.category))];

        legend.selectAll(".legend-item")
            .data(categories)
            .enter()
            .append("rect")
            .append("div")
            .attr("class", "legend-item")
            .html(d => `
                <span class="legend-color" style="background:${colorScale(d)};"></span>
                <span class="legend-text">${d}</span>
            `);
    });