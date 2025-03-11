// Instead of ES6 imports, we'll use the globally available React objects
// and manually import our components

// Get references to React and ReactDOM from the global scope
const React = window.React;
const ReactDOM = window.ReactDOM;

// We'll load our App component after all other components are loaded
// This will be called from index.html after all component scripts are loaded
window.renderApp = function() {
  ReactDOM.render(
    React.createElement(React.StrictMode, null, 
      React.createElement(App, null)
    ),
    document.getElementById('root')
  );
}; 