/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

const React = require('react');

exports.onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([
    <script
      key="algolia-experiences"
      src="https://cdn.jsdelivr.net/npm/@algolia/experiences/dist/experiences.js?appId=UDWYP6UETT&apiKey=53634368ea2d49f07fd3428e7603a47c&experienceId=UDWYP6UETT&env=prod"
    />,
  ]);
};
