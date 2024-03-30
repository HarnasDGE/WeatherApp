import { connect } from "react-redux";
import { mapDispatchToProps, mapStateToProps } from "../containers/containerWeather";
import React from "react";
import * as d3 from 'd3';
import { getIconLinkWithHour } from "./methods/iconsMethods";


class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTemperature: true,
            isPercipitation: true,
            isClouds: false
        }
        this.graphContainerRef = React.createRef(); 
    }

    componentDidMount() {
        this.drawGraph();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data !== prevProps.data || 
            this.state.isTemperature !== prevState.isTemperature || 
            this.state.isPercipitation !== prevState.isPercipitation || 
            this.state.isClouds !== prevState.isClouds ||
            this.props.day !== prevProps.day) {
            d3.select("#precipitation").select("svg").remove(); // Usuń istniejący wykres
            this.drawGraph(); // Rysuj wykres ponownie
        }
    }

    toggleTemperature = () => {
        this.setState(prevState => ({isTemperature: !prevState.isTemperature}));
    }

    togglePercipitation = () => {
        this.setState(prevState => ({isPercipitation: !prevState.isPercipitation}));
    }

    toggleClouds = () => {
        this.setState(prevState => ({isClouds: !prevState.isClouds}));
    }

    drawGraph = () => {
    if(!this.props.data.hourly) return;
    d3.select("#precipitation svg").remove();
    
    const actualDay = this.props.day;
    const startIndex = actualDay * 24;
    const endIndex = startIndex + 24;

    const actualDate = new Date();
    const actualHour = actualDate.getHours().toString().padStart(2, '0') + ":00";

    const hours = this.props.data.hourly.time;
    const precipitationLevels = this.props.data.hourly.precipitationProbability;
    const temperatureLevels = this.props.data.hourly.temperature2m;
    const weatherCodes = this.props.data.hourly.weatherCode;
    const cloudLevels = this.props.data.hourly.cloudCover;
    
    let forecast = hours
        .map((hour, index) => ({
            hour: hour.substring(11,16),
            temperature: Math.round(temperatureLevels[index]*10)/10,
            precipitation: precipitationLevels[index],
            icon: getIconLinkWithHour(weatherCodes[index], new Date(hour)),
            cloud: cloudLevels[index]
        }));

    forecast = forecast.slice(startIndex, endIndex);
    
    const containerWidth = this.graphContainerRef.current.clientWidth;
    const containerHeight = this.graphContainerRef.current.clientHeight; // Lub ustal wysokość statycznie, jeśli wolisz

    const margin = { top: 30, right: 20, bottom: 20, left: 20 },
    width = containerWidth - margin.left - margin.right,
    height = containerHeight - margin.top - margin.bottom;

    // Skala dla osi X
    const x = d3.scaleBand()
    .range([0, width])
    .domain(forecast.map(d => d.hour))
    .padding(0.1); // Dodaje trochę przestrzeni między słupkami

    // Skala dla osi Y
    const y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 110]);

     // Skala dla osi Y (temperatura)
    const yTemperature = d3.scaleLinear()
    .range([height, 0])
    .domain([d3.min(forecast, d => d.temperature)-5, d3.max(forecast, d => d.temperature)+5]);

    const yCloud = d3.scaleLinear()
    .range([height, 0])
    .domain([d3.min(forecast, d => d.cloud)-5, d3.max(forecast, d => d.cloud)+5]);

    const svg = d3.select("#precipitation").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top}) `);

    svg.selectAll(".actualHour")
    .data(forecast)
    .enter().append("rect")
        .attr("class", "actualHour")
        .attr("x", d => x(d.hour))
        .attr("y", y(140))
        .attr("width", x.bandwidth())
        .attr("height", height + 40)
        .attr("fill", d => d.hour === actualHour && this.props.day === 0 ? "rgba(255,255,255,0.3" : "none");


    if(this.state.isPercipitation) { // Dodanie słupków
        svg.selectAll(".bar")
        .data(forecast)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.hour))
            .attr("y", d => y(d.precipitation))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.precipitation))
            .attr("fill", "steelblue");

            // Dodanie tekstu dla opadów
        svg.selectAll(".precipitation-text")
            .data(forecast)
            .enter().append("text")
            .attr("class", "precipitation-text") // Klasa dla stylizacji, jeśli jest potrzebna
            .attr("x", d => x(d.hour) + x.bandwidth() / 2) // Wycentrowanie tekstu na słupku
            .attr("y", y(5)) // Ustawienie tekstu nieco powyżej słupka
            .text(d => d.precipitation !== 0 ? `${d.precipitation}%` : '') // Wyświetlenie wartości opadów
            .attr("text-anchor", "middle") // Centrowanie tekstu względem punktu x
            .style("fill", "rgba(255,255,255,0.5") // Kolor tekstu
            .style("font-size", "11px"); // Rozmiar czcionki
    }

if(this.state.isClouds) {
    const lineGeneratorClouds = d3.line()
        .x(d => x(d.hour) + x.bandwidth() / 2) // Centrowanie linii w pasmach
        .y(d => yCloud(d.cloud))
        .curve(d3.curveMonotoneX); // Dla gładkiej linii

    svg.append("path")
        .datum(forecast) // Przekazanie danych temperatury
        .attr("class", "clouds-line") // Dodanie klasy dla potencjalnego łatwiejszego usuwania
        .attr("fill", "none")
        .attr("stroke", "#D0AF00") // Kolor linii
        .attr("stroke-width", 2)
        .attr("d", lineGeneratorClouds);

    svg.selectAll(".dotCloud")
        .data(forecast)
        .enter().append("circle") // Dodaje kropki
        .attr("class", "dotCloud") // Klasa CSS dla stylizacji, jeśli potrzebna
        .attr("cx", d => x(d.hour) + x.bandwidth() / 2)
        .attr("cy", d => yCloud(d.cloud))
        .attr("r", 3) // Promień kropki
        .style("fill", "#D0AF00"); // Kolor kropki


    svg.selectAll(".cloudsText")
        .data(forecast)
        .enter().append("text")
        .attr("class", "cloudsText") // Klasa CSS dla stylizacji, jeśli potrzebna
        .attr("x", d => x(d.hour) + x.bandwidth() / 2)
        .attr("y", d => yCloud(d.cloud) - 10) // Aby tekst był trochę powyżej kropki
        .text(d => `${d.cloud}`) // Tekst do wyświetlenia
        .attr("text-anchor", "middle") // Centruje tekst względem punktu
        .style("fill", "#D0AF00") // Kolor tekstu
        .style("font-size", "12px"); // Rozmiar czcionki
    }

    
    svg.selectAll(".temperature-line").remove();

if(this.state.isTemperature) {

    const lineGenerator = d3.line()
        .x(d => x(d.hour) + x.bandwidth() / 2) // Centrowanie linii w pasmach
        .y(d => yTemperature(d.temperature))
        .curve(d3.curveMonotoneX); // Dla gładkiej linii

    svg.append("path")
        .datum(forecast) // Przekazanie danych temperatury
        .attr("class", "temperature-line") // Dodanie klasy dla potencjalnego łatwiejszego usuwania
        .attr("fill", "none")
        .attr("stroke", "#01e97d") // Kolor linii
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);

    svg.selectAll(".dot")
        .data(forecast)
        .enter().append("circle") // Dodaje kropki
        .attr("class", "dot") // Klasa CSS dla stylizacji, jeśli potrzebna
        .attr("cx", d => x(d.hour) + x.bandwidth() / 2)
        .attr("cy", d => yTemperature(d.temperature))
        .attr("r", 3) // Promień kropki
        .style("fill", "#01e97d"); // Kolor kropki


    svg.selectAll(".temperatureText")
        .data(forecast)
        .enter().append("text")
        .attr("class", "temperatureText") // Klasa CSS dla stylizacji, jeśli potrzebna
        .attr("x", d => x(d.hour) + x.bandwidth() / 2)
        .attr("y", d => yTemperature(d.temperature) - 10) // Aby tekst był trochę powyżej kropki
        .text(d => `${d.temperature}`) // Tekst do wyświetlenia
        .attr("text-anchor", "middle") // Centruje tekst względem punktu
        .style("fill", "#01e97d") // Kolor tekstu
        .style("font-size", "12px"); // Rozmiar czcionki
}
    
    // Dodanie osi X
    svg.append("g")
        .attr("transform", `translate(0,${height}) `)
        .call(d3.axisBottom(x));


        // Dodanie obrazków
    svg.selectAll(".weather-icon")
        .data(forecast) // Użyj swoich danych pogodowych
        .enter().append("image")
        .attr("xlink:href", d => d.icon) // Ustaw źródło obrazka na podstawie warunku pogodowego
        .attr("x", d => x(d.hour) + (x.bandwidth() / 2) - 15) // Wycentrowanie obrazka względem słupka/godziny, -10 dla przykładowego rozmiaru ikony 20x20
        .attr("y", d => y(135)) // Ustawienie obrazka nieco powyżej słupka
        .attr("width", 30) // Szerokość ikony
        .attr("height", 30); // Wysokość ikony
    }

    render() {
        return (
        <div className="graph" style={{width: "100%", height: "200px"}}>
            <div id="precipitation" style={{width: "80%", height: "100%"}}  ref={this.graphContainerRef}></div> 
            <div className="graph-options" style={{width: "20%", height: "100%"}}>
                <div className="checkbox-wrapper-2">
                    <label htmlFor="temperature" className="temperature-label"><input type="checkbox" className="sc-gJwTLC ikxBAC" id="temperature" checked={this.state.isTemperature} onChange={this.toggleTemperature}/>Temparature</label>
                    <label htmlFor="rainfall" className="rainfall-label"><input type="checkbox" className="sc-gJwTLC ikxBAC" id="rainfall" checked={this.state.isPercipitation} onChange={this.togglePercipitation}/>Rainfall</label>
                    <label htmlFor="clouds" className="clouds-label"><input type="checkbox" className="sc-gJwTLC ikxBAC" id="clouds" checked={this.state.isClouds} onChange={this.toggleClouds}/>Clouds</label>
                </div>
            </div>
        </div>
        )
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(Graph);
export default Container;

