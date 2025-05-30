import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";
import { usePathname } from "expo-router";

/**
 * This file is web-only and used to configure the root HTML for every web page during static rendering.
 * The contents of this function only run in Node.js environments and do not have access to the DOM or browser APIs.
 */
export default function Root({ children }: PropsWithChildren) {

  const pathname = usePathname();
  const routeSegment = pathname.split("/").pop();
  const pageTitle = routeSegment 
    ? `${routeSegment.charAt(0).toUpperCase()}${routeSegment.slice(1).replace(/-/g, ' ')}`
    : 'Home';

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        
        <title>{`ViraShare - ${pageTitle}`}</title>

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers in dark-mode. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>
        <div className="app-wrapper">{children}</div>
      </body>

    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #E5F3F5;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
}
}
.app-wrapper {
  width: 100%;
  max-width: 768px;
  min-height: 100vh;
}
`;
