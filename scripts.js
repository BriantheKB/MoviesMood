// Global Variables
let moviesData = [];

// Helper Functions
const moodColors = {
    "Thoughtful": "#1f77b4",
    "Tense": "#ff7f0e",
    "Curious": "#2ca02c",
    "Adventurous": "#d62728",
    "Anxious": "#9467bd",
    "Joyful": "#8c564b",
    "Excited": "#e377c2",
    "Amused": "#7f7f7f",
    "Soulful": "#bcbd22",
    "Affectionate": "#17becf"
};

// Populate dropdowns
function populateDropdowns() {
    // Get all unique years from the data
    const uniqueYears = [...new Set(moviesData.map(movie => movie.release_year))].sort();
    const yearDropdown = document.getElementById("year-dropdown");

    // Add each unique year to the dropdown
    uniqueYears.forEach(year => {
        const option = document.createElement("option");
        option.value = year;
        option.innerText = year;
        yearDropdown.appendChild(option);
    });

    // Get all unique moods from the data
    const uniqueMoods = [...new Set(moviesData.map(movie => movie.movie_mood))].filter(mood => mood).sort();
    const moodDropdown = document.getElementById("mood-dropdown");
    uniqueMoods.forEach(mood => {
        const option = document.createElement("option");
        option.value = mood;
        option.innerText = mood;
        moodDropdown.appendChild(option);
    });

    // Get all unique genres from the data
    const uniqueGenres = [...new Set(moviesData.map(movie => movie.primary_genre))].sort();
    const genreDropdown = document.getElementById("genre-dropdown");
    uniqueGenres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre;
        option.innerText = genre;
        genreDropdown.appendChild(option);
    });
}

function drawTopMoviesBarChart() {
    console.log("drawTopMoviesBarChart called");

    // Fetch selected filters
    const selectedYear = document.getElementById("year-dropdown").value;
    console.log("Selected year:", selectedYear);

    const selectedNumMovies = parseInt(document.getElementById("num-movies-dropdown").value, 10);
    const selectedMood = document.getElementById("mood-dropdown").value;
    const selectedGenre = document.getElementById("genre-dropdown").value;

    console.log("Selected NumMovies:", selectedNumMovies, "Selected Mood:", selectedMood, "Selected Genre:", selectedGenre);

    // Filter data based on selections
    let filteredMovies = moviesData.filter(movie => 
        (selectedYear === "all" || movie.release_year === parseInt(selectedYear, 10)) &&
        (selectedMood === "all" || movie.movie_mood === selectedMood) &&
        (selectedGenre === "all" || movie.primary_genre === selectedGenre)
    );

    console.log("Filtered movies count:", filteredMovies.length);
    console.log("First few filtered movies:", filteredMovies.slice(0, 5));

    // Sort by popularity and slice to get top N movies
    filteredMovies = filteredMovies.sort((a, b) => b.popularity - a.popularity).slice(0, selectedNumMovies);

    console.log("Top movies after sort:", filteredMovies);

    // Prepare data for Plotly
    const data = [{
        x: filteredMovies.map(movie => movie.title),
        y: filteredMovies.map(movie => movie.popularity),
        type: 'bar',
        marker: {
            color: filteredMovies.map(movie => moodColors[movie.movie_mood])
        }
    }];

    const layout = {
        title: 'Top Movies by Popularity',
        xaxis: {
            title: 'Movie Title'
        },
        yaxis: {
            title: 'Popularity'
        }
    };

    Plotly.newPlot('top-movies-bar-chart', data, layout);
}



function drawVoteAverageDistribution() {
    const genreData = {};

    moviesData.forEach(movie => {
        if (!genreData[movie.primary_genre]) {
            genreData[movie.primary_genre] = [];
        }
        genreData[movie.primary_genre].push(movie.vote_average);
    });

    const traces = [];

    for (let genre in genreData) {
        traces.push({
            name: genre,
            y: genreData[genre],
            type: 'box',
            boxpoints: 'all',
        });
    }

    const layout = {
        title: 'Vote Average Distribution by Genre',
        yaxis: {
            title: 'Vote Average'
        }
    };

    Plotly.newPlot('vote-average-distribution', traces, layout);
}

function drawPopularityDistribution() {
    const genreData = {};

    moviesData.forEach(movie => {
        if (!genreData[movie.primary_genre]) {
            genreData[movie.primary_genre] = [];
        }
        genreData[movie.primary_genre].push(movie.popularity);
    });

    const traces = [];

    for (let genre in genreData) {
        traces.push({
            name: genre,
            y: genreData[genre],
            type: 'box',
            boxpoints: 'all',
        });
    }

    const layout = {
        title: 'Popularity Distribution by Genre',
        yaxis: {
            title: 'Popularity'
        }
    };

    Plotly.newPlot('popularity-distribution', traces, layout);
}

function drawVoteCountDistribution() {
    const genreData = {};

    moviesData.forEach(movie => {
        if (!genreData[movie.primary_genre]) {
            genreData[movie.primary_genre] = [];
        }
        genreData[movie.primary_genre].push(movie.vote_count);
    });

    const traces = [];

    for (let genre in genreData) {
        traces.push({
            name: genre,
            y: genreData[genre],
            type: 'box',
            boxpoints: 'all',
        });
    }

    const layout = {
        title: 'Vote Count Distribution by Genre',
        yaxis: {
            title: 'Vote Count'
        }
    };

    Plotly.newPlot('vote-count-distribution', traces, layout);
}

function drawGenreMoodDistribution() {
    const genreMoodData = {};

    moviesData.forEach(movie => {
        if (!genreMoodData[movie.primary_genre]) {
            genreMoodData[movie.primary_genre] = {};
        }
        if (movie.movie_mood) {
            if (!genreMoodData[movie.primary_genre][movie.movie_mood]) {
                genreMoodData[movie.primary_genre][movie.movie_mood] = 0;
            }
            genreMoodData[movie.primary_genre][movie.movie_mood]++;
        }
    });

    const data = [];
    Object.keys(genreMoodData).forEach(genre => {
        data.push({
            x: Object.keys(genreMoodData[genre]),
            y: Object.values(genreMoodData[genre]),
            name: genre,
            type: 'bar',
            marker: {
                color: Object.keys(genreMoodData[genre]).map(mood => moodColors[mood]),
            }
        });
    });

    const layout = {
        title: 'Mood Distribution per Genre',
        xaxis: {
            title: 'Mood'
        },
        yaxis: {
            title: 'Number of Movies'
        },
        barmode: 'stack'
    };

    Plotly.newPlot('genre-mood-distribution', data, layout);
}

function drawYearlyMoodTrend() {
    const yearlyMoodData = {};

    moviesData.forEach(movie => {
        if (!yearlyMoodData[movie.release_year]) {
            yearlyMoodData[movie.release_year] = {};
        }
        if (movie.movie_mood) {
            if (!yearlyMoodData[movie.release_year][movie.movie_mood]) {
                yearlyMoodData[movie.release_year][movie.movie_mood] = 0;
            }
            yearlyMoodData[movie.release_year][movie.movie_mood]++;
        }
    });

    const data = [];
    Object.keys(moodColors).forEach(mood => {
        const yearlyValues = [];
        Object.keys(yearlyMoodData).sort().forEach(year => {
            yearlyValues.push(yearlyMoodData[year][mood] || 0);
        });
        data.push({
            x: Object.keys(yearlyMoodData).sort(),
            y: yearlyValues,
            name: mood,
            type: 'line',
            marker: {
                color: moodColors[mood]
            }
        });
    });

    const layout = {
        title: 'Yearly Trend of Moods',
        xaxis: {
            title: 'Year'
        },
        yaxis: {
            title: 'Number of Movies'
        }
    };

    Plotly.newPlot('yearly-mood-trend', data, layout);
}

function drawTopGenreForMoods() {
    const moodGenreData = {};

    moviesData.forEach(movie => {
        if (movie.movie_mood && movie.primary_genre) {
            if (!moodGenreData[movie.movie_mood]) {
                moodGenreData[movie.movie_mood] = {};
            }
            if (!moodGenreData[movie.movie_mood][movie.primary_genre]) {
                moodGenreData[movie.movie_mood][movie.primary_genre] = 0;
            }
            moodGenreData[movie.movie_mood][movie.primary_genre]++;
        }
    });

    const topGenres = [];
    const moods = Object.keys(moodGenreData);
    moods.forEach(mood => {
        const genres = Object.keys(moodGenreData[mood]);
        genres.sort((a, b) => moodGenreData[mood][b] - moodGenreData[mood][a]);
        topGenres.push(genres[0]);
    });

    const data = [{
        x: moods,
        y: topGenres,
        type: 'bar',
        marker: {
            color: moods.map(mood => moodColors[mood])
        }
    }];

    const layout = {
        title: 'Top Primary Genre for Each Mood',
        xaxis: {
            title: 'Mood'
        },
        yaxis: {
            title: 'Primary Genre'
        }
    };

    Plotly.newPlot('top-primary-genres', data, layout);
}

function drawMoviesOverYears() {
    const yearData = {};

    moviesData.forEach(movie => {
        if (movie.release_year) {
            if (!yearData[movie.release_year]) {
                yearData[movie.release_year] = 0;
            }
            yearData[movie.release_year]++;
        }
    });

    const sortedYears = Object.keys(yearData).sort();
    const values = sortedYears.map(year => yearData[year]);

    const data = [{
        x: sortedYears,
        y: values,
        type: 'bar'
    }];

    const layout = {
        title: 'Distribution of Movies Over the Years',
        xaxis: {
            title: 'Release Year'
        },
        yaxis: {
            title: 'Number of Movies'
        }
    };

    Plotly.newPlot('top-genre-for-moods', data, layout);
}

function drawTopPrimaryGenres() {
    const genreData = {};

    moviesData.forEach(movie => {
        if (movie.primary_genre) {
            if (!genreData[movie.primary_genre]) {
                genreData[movie.primary_genre] = 0;
            }
            genreData[movie.primary_genre]++;
        }
    });

    const sortedGenres = Object.keys(genreData).sort((a, b) => genreData[b] - genreData[a]);
    const values = sortedGenres.map(genre => genreData[genre]);

    const data = [{
        x: sortedGenres,
        y: values,
        type: 'bar'
    }];

    const layout = {
        title: 'Top Primary Genres',
        xaxis: {
            title: 'Primary Genre'
        },
        yaxis: {
            title: 'Number of Movies'
        }
    };

    Plotly.newPlot('top-primary-genres', data, layout);
}

// Attach event listener for wordcloud dropdown
document.querySelectorAll("#wordcloud-buttons button").forEach(button => {
    button.addEventListener("click", function() {
        const selectedDecade = this.getAttribute('data-decade');
        document.querySelectorAll(".wordcloud-image").forEach(img => img.style.display = 'none');
        document.getElementById(`wordcloud-${selectedDecade}`).style.display = 'block';
    });
});

// Your DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            moviesData = data;
            populateDropdowns();

            drawTopMoviesBarChart();  // Draw the chart initially

            document.getElementById("year-dropdown").addEventListener("change", drawTopMoviesBarChart);
            document.getElementById("num-movies-dropdown").addEventListener("change", drawTopMoviesBarChart);
            document.getElementById("mood-dropdown").addEventListener("change", drawTopMoviesBarChart);
            document.getElementById("genre-dropdown").addEventListener("change", drawTopMoviesBarChart);

            updateVisualizations();  // Draw the initial visualizations

            // Set default word cloud to 2020s after all event listeners
            document.getElementById("wordcloud-2020s").style.display = 'block'; // Show 2020s as default
        });
});

// Update Visualizations function
function updateVisualizations() {
    drawVoteAverageDistribution();
    drawPopularityDistribution();
    drawVoteCountDistribution();
    drawGenreMoodDistribution();
    drawYearlyMoodTrend();
    drawTopGenreForMoods();
    drawMoviesOverYears();
    drawTopPrimaryGenres();
    console.log("Updated visualizations based on filters");
}

