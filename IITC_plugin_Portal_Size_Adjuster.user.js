// ==UserScript==
// @id             iitc-plugin-portal-size-adjuster@sample
// @name           IITC plugin: Portal Size Adjuster
// @category       Layer
// @version        0.2.1
// @description    Allows users to adjust the portal marker size on the map for better visibility. Initializes with the default size.
// @updateURL      https://github.com/tarmn3/iitc_PortalSizeAdjuster/raw/main/IITC_plugin_Portal_Size_Adjuster.user.js
// @downloadURL    https://github.com/tarmn3/iitc_PortalSizeAdjuster/raw/main/IITC_plugin_Portal_Size_Adjuster.user.js
// @include        /^https://.*\.ingress\.com\/intel.*/
// @match          *://*/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
    // Ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function') window.plugin = function() {};

    // Use own namespace for plugin
    window.plugin.portalSizeAdjuster = function() {};
    var self = window.plugin.portalSizeAdjuster;

    // Function to adjust portal size
    self.adjustPortalSize = function(scaleFactor) {
        window.userDefinedScale = scaleFactor; // Update global scale factor

        // Reload portals to apply the new size
        window.resetHighlightedPortals();
        console.log('Portal size adjusted to scale factor:', scaleFactor);
    };

    // Override getMarkerStyleOptions to adjust portal size based on user selection
    window.getMarkerStyleOptionsOriginal = window.getMarkerStyleOptions; // Backup original function
    window.getMarkerStyleOptions = function(details) {
        var options = window.getMarkerStyleOptionsOriginal(details);
        options.radius *= window.userDefinedScale; // Apply user-defined scale
        return options;
    };

    // Add option menu to the toolbox
    self.setup = function() {
        // Set the default scale factor to 1 to ensure portals are displayed upon plugin load
        window.userDefinedScale = 1;
        window.resetHighlightedPortals(); // Update portal display immediately

        var html = '<a onclick="window.plugin.portalSizeAdjuster.showMenu();">Portal Size Adjuster</a>';
        $('#toolbox').append(html);
    };

    // Show option menu
    self.showMenu = function() {
        var html = '<div id="portal-size-adjuster-dialog">'
                 + '<p><a onclick="window.plugin.portalSizeAdjuster.adjustPortalSize(0.5);">Small</a></p>'
                 + '<p><a onclick="window.plugin.portalSizeAdjuster.adjustPortalSize(1);">Medium</a></p>'
                 + '<p><a onclick="window.plugin.portalSizeAdjuster.adjustPortalSize(1.5);">Large</a></p>'
                 + '</div>';
        dialog({html: html, title: 'Adjust Portal Size'});
    };

    // Initialization
    var setup =  self.setup;
    setup.info = plugin_info; // Add plugin info to the function as a property
    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    if (window.iitcLoaded && typeof setup === 'function') setup();
}

// Inject code into site context
var script = document.createElement('script');
script.type = 'text/javascript';
script.appendChild(document.createTextNode('('+ wrapper +')(/* plugin_info */);'));
(document.body || document.head || document.documentElement).appendChild(script);
