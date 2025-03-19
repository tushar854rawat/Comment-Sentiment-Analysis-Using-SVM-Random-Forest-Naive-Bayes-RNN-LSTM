import React, { useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";

import "chart.js/auto";

const App = () => {
  const [videoLink, setVideoLink] = useState("");
  const [comments, setComments] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAllComments, setShowAllComments] = useState(false);

  // Extract video ID from YouTube link
  const extractVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Fetch comments
  const fetchComments = async (videoId) => {
    const apiKey = "AIzaSyAF3hA7hfJGtgirmCMdn49Su7l0FREmvdc";
    const maxResults = 100;
    let allComments = [];
    let nextPageToken = "";

    try {
      do {
        const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}&maxResults=${maxResults}&pageToken=${nextPageToken}`;

        const response = await axios.get(url);
        const commentsArray = response.data.items.map(
          (item) => item.snippet.topLevelComment.snippet.textDisplay
        );

        allComments = [...allComments, ...commentsArray];
        nextPageToken = response.data.nextPageToken || "";

        if (allComments.length >= 500) break;
      } while (nextPageToken);

      return allComments;
    } catch (err) {
      console.error("Error fetching comments:", err);
      throw err;
    }
  };

  // Fetch predictions
  const fetchPredictions = async (comments) => {
    try {
      const response = await axios.post("http://localhost:5500/predict", {
        comments,
      });
      return response.data.predictions;
    } catch (err) {
      console.error("Error fetching predictions:", err);
      throw err;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setComments([]);
    setPredictions([]);

    const videoId = extractVideoId(videoLink);

    if (!videoId) {
      setError("Invalid YouTube link. Please provide a valid video URL.");
      setLoading(false);
      return;
    }

    try {
      const fetchedComments = await fetchComments(videoId);
      setComments(fetchedComments);
      const sentimentPredictions = await fetchPredictions(fetchedComments);
      setPredictions(sentimentPredictions);
    } catch (err) {
      setError("An error occurred while processing your request.");
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setVideoLink("");
    setComments([]);
    setPredictions([]);
    setError(null);
    setShowAllComments(false);
  };

  // Compute sentiment percentages and counts
  const calculateAnalytics = () => {
    const sentimentCounts = predictions.reduce(
      (counts, prediction) => {
        counts[prediction.sentiment]++;
        return counts;
      },
      { positive: 0, negative: 0, neutral: 0 }
    );

    const total = predictions.length;
    return {
      counts: sentimentCounts,
      percentages: {
        positive: ((sentimentCounts.positive / total) * 100).toFixed(2),
        negative: ((sentimentCounts.negative / total) * 100).toFixed(2),
        neutral: ((sentimentCounts.neutral / total) * 100).toFixed(2),
      },
    };
  };

  const analytics = calculateAnalytics();

  const pieChartData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        data: [
          analytics.percentages.positive,
          analytics.percentages.negative,
          analytics.percentages.neutral,
        ],
        backgroundColor: ["#6DD5FA", "#FF6A95", "#FFD700"],
        hoverBackgroundColor: ["#1E90FF", "#FF1493", "#FFA500"],
      },
    ],
  };

  const barChartData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        label: "Sentiment Counts",
        data: [
          analytics.counts.positive,
          analytics.counts.negative,
          analytics.counts.neutral,
        ],
        backgroundColor: ["#6DD5FA", "#FF6A95", "#FFD700"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white flex flex-col items-center justify-center p-4">
      <h1
        className="text-4xl font-extrabold mb-6 text-center text-gradient bg-gradient-to-r from-blue-400 via-green-400 to-purple-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        YouTube Comment Sentiment Analyzer
      </h1>

      <form
        className="w-full max-w-lg bg-gray-800 p-6 rounded shadow-lg"
        onSubmit={handleSubmit}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <label htmlFor="videoLink" className="block text-sm font-medium mb-2">
            Enter YouTube Video Link
          </label>
          <input
            type="text"
            id="videoLink"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="https://www.youtube.com/watch?v=example"
          />
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="w-5/12 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white py-2 px-4 rounded font-semibold focus:outline-none focus:ring focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Analyzing..." : "Analyze Comments"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-5/12 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white py-2 px-4 rounded font-semibold focus:outline-none focus:ring focus:ring-red-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </button>
        </div>
      </form>

      {error && (
        <p
          className="text-red-500 mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {error}
        </p>
      )}

      {comments.length > 0 && predictions.length > 0 && (
        <div
          className="mt-6 w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            {showAllComments ? "All Comments and Sentiments" : "Top 5 Comments and Sentiments"}
          </h2>

          <ul className="space-y-4">
            {(showAllComments ? comments : comments.slice(0, 5)).map(
              (comment, index) => (
                <li
                  key={index}
                  className="bg-gray-800 p-4 rounded shadow-md flex justify-between items-start"
                >
                  <p className="flex-1 mr-4 text-sm text-gray-300">{comment}</p>
                  <span
                    className={`px-3 py-1 rounded font-semibold text-sm text-white ${
                      predictions[index]?.sentiment === "positive"
                        ? "bg-green-600"
                        : predictions[index]?.sentiment === "negative"
                        ? "bg-red-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {predictions[index]?.sentiment || "Unknown"}
                  </span>
                </li>
              )
            )}
          </ul>

          <button
            className="mt-4 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white py-2 px-4 rounded"
            onClick={() => setShowAllComments(!showAllComments)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showAllComments ? "Show Top 5 Comments" : "View All Comments"}
          </button>

          <h2 className="text-2xl font-bold mt-8 text-center">Sentiment Analytics</h2>
          <div className="flex flex-col md:flex-row justify-around items-center mt-4">
            <div className="w-full md:w-1/2 p-4" whileHover={{ scale: 1.05 }}>
              <Pie data={pieChartData} />
            </div>
            <div className="w-full md:w-1/2 p-4" whileHover={{ scale: 1.05 }}>
              <Bar data={barChartData} />
            </div>
          </div>

          <div className="text-center mt-4">
            <p>Total Comments: {comments.length}</p>
            <p>Positive: {analytics.counts.positive}</p>
            <p>Negative: {analytics.counts.negative}</p>
            <p>Neutral: {analytics.counts.neutral}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;