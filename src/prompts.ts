export const extractTitleSysPrompt = `
Task: Based on user input generate a short title describing nature of the data. 

Example input: A line chart tracking car sales trends over the course of a week: Mon: 150, Tue: 230, Wed: 224, Thu: 218, Fri: 135, Sat: 147, Sun: 260.
Example output: Sales trends 

Example input: A bar chart displaying daily car dealership sales volume: Mon: 120, Tue: 200, Wed: 150, Thu: 80, Fri: 70, Sat: 110, Sun: 130.
Example output: Dealership sales volume

Example input: A grouped bar chart comparing performance across the years 2015, 2016, and 2017 for four products: Matcha Latte (43.3, 85.8, 93.7), Milk Tea (83.1, 73.4, 55.1), Cheese Cocoa (86.4, 65.2, 82.5), and Walnut Brownie (72.4, 53.9, 39.1).
Example output: Performance across the years

Example input: A pie chart titled 'Referer of a Website' displaying traffic sources: Search Engine (1048), Direct (735), Email (580), Union Ads (484), and Video Ads (300).
Example output: Referer of a Website

Example input: A funnel chart titled 'Funnel' illustrating the car purchase conversion pipeline with a gap of 2 between stages: Show (100), Click (80), Visit (60), Inquiry (40), and Order (20).
Example output: Funnel

CRITICAL RULES:
Do not include any additional info in the output.
`;

export const extractChartTypeSysPrompt = `
Task: From the context of user message classify data into one of the following types: [line, bar, bar-grouped, pie, funnel].

Example input: A line chart tracking car sales trends over the course of a week: Mon: 150, Tue: 230, Wed: 224, Thu: 218, Fri: 135, Sat: 147, Sun: 260.
Example output: line

Example input: A bar chart displaying daily car dealership sales volume: Mon: 120, Tue: 200, Wed: 150, Thu: 80, Fri: 70, Sat: 110, Sun: 130.
Example output: bar

Example input: A grouped bar chart comparing performance across the years 2015, 2016, and 2017 for four products: Matcha Latte (43.3, 85.8, 93.7), Milk Tea (83.1, 73.4, 55.1), Cheese Cocoa (86.4, 65.2, 82.5), and Walnut Brownie (72.4, 53.9, 39.1).
Example output: bar-grouped

Example input: A pie chart titled "Referer of a Website" displaying traffic sources: Search Engine (1048), Direct (735), Email (580), Union Ads (484), and Video Ads (300).
Example output: pie

Example input: A funnel chart titled "Funnel" illustrating the car purchase conversion pipeline with a gap of 2 between stages: Show (100), Click (80), Visit (60), Inquiry (40), and Order (20).
Example output: funnel

CRITICAL RULES:
Respond only with one of [line, bar, bar-grouped, pie, funnel]!
`;

export const extractChartLabelsSysPrompt = `
Task: Extract the labels from the data.

Example input: Chart type is line. A line chart tracking car sales trends over the course of a week: Mon: 150, Tue: 230, Wed: 224, Thu: 218, Fri: 135, Sat: 147, Sun: 260.
Example output: Mon, Tue, Wed, Thu, Fri, Sat, Sun,

Example input: Chart type is bar. A bar chart displaying daily car dealership sales volume: Mon: 120, Tue: 200, Wed: 150, Thu: 80, Fri: 70, Sat: 110, Sun: 130.
Example output: Mon, Tue, Wed, Thu, Fri, Sat, Sun,

Example input: Chart type is bar-grouped. A grouped bar chart comparing performance across the years 2015, 2016, and 2017 for four products: Matcha Latte (43.3, 85.8, 93.7), Milk Tea (83.1, 73.4, 55.1), Cheese Cocoa (86.4, 65.2, 82.5), and Walnut Brownie (72.4, 53.9, 39.1).
Example output: product, 2015, 2016, 2017,

Example input: Chart type is pie. A pie chart titled "Referer of a Website" displaying traffic sources: Search Engine (1048), Direct (735), Email (580), Union Ads (484), and Video Ads (300).
Example output: Search Engine, Direct, Email, Union Ads, Video Ads,

Example input: Chart type is funnel. A funnel chart titled "Funnel" illustrating the car purchase conversion pipeline with a gap of 2 between stages: Show (100), Click (80), Visit (60), Inquiry (40), and Order (20).
Example output: Show, Click, Visit, Inquiry, Order,
`;

export const extractChartDataSysPrompt = `
Task: Extract the data from the user message.

Example input: Chart type is line. A line chart tracking car sales trends over the course of a week: Mon: 150, Tue: 230, Wed: 224, Thu: 218, Fri: 135, Sat: 147, Sun: 260.
Example output: [150, 230, 224, 218, 135, 147, 260]

Example input: Chart type is bar. A bar chart displaying daily car dealership sales volume: Mon: 120, Tue: 200, Wed: 150, Thu: 80, Fri: 70, Sat: 110, Sun: 130.
Example output: [120, 200, 150, 80, 70, 110, 130]

Example input: Chart type is bar-grouped. A grouped bar chart comparing performance across the years 2015, 2016, and 2017 for four products: Matcha Latte (43, 85, 93), Milk Tea (83, 73, 55), Cheese Cocoa (86, 65, 82), and Walnut Brownie (72, 53, 39).
Example output: [[43, 85, 93], [83, 73, 55], [86, 65, 82], [72, 53, 39]]

Example input: Chart type is pie. A pie chart titled "Referer of a Website" displaying traffic sources: Search Engine (1048), Direct (735), Email (580), Union Ads (484), and Video Ads (300).
Example output: [1048, 735, 580, 484, 300]

Example input: Chart type is funnel. A funnel chart titled "Funnel" illustrating the car purchase conversion pipeline with a gap of 2 between stages: Show (100), Click (80), Visit (60), Inquiry (40), and Order (20).
Example output: [100, 80, 60, 40, 20]

CRITICAL RULES:
Respond only with array of data points separated by commas!
`;

export const generateChartConfigSysPrompt = `
Task: Generate Apache ECharts JSON config based on title, chart type, labels and data provided by the user.

Example output for line chart: {"xAxis":{"type":"category","data":["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]},"yAxis":{"type":"value"},"series":[{"data":[150,230,224,218,135,147,260],"type":"line"}]}

Example output for bar chart: {"xAxis":{"type":"category","data":["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]},"yAxis":{"type":"value"},"series":[{"data":[120,200,150,80,70,110,130],"type":"bar"}]}

Example output for bar-grouped chart: {"dataset":{"dimensions":["product","2015","2016","2017"],"source":[{"product":"Matcha Latte","2015":43.3,"2016":85.8,"2017":93.7},{"product":"Milk Tea","2015":83.1,"2016":73.4,"2017":55.1},{"product":"Cheese Cocoa","2015":86.4,"2016":65.2,"2017":82.5},{"product":"Walnut Brownie","2015":72.4,"2016":53.9,"2017":39.1}]},"xAxis":{"type":"category"},"series":[{"type":"bar"},{"type":"bar"},{"type":"bar"}]}

Example output for pie chart: {"title":{"text":"Referer of a Website"},"series":[{"type":"pie","data":[{"value":1048,"name":"Search Engine"},{"value":735,"name":"Direct"},{"value":580,"name":"Email"},{"value":484,"name":"Union Ads"},{"value":300,"name":"Video Ads"}]}]}

Example output for funnel chart: {"title":{"text":"Funnel"},"series":[{"name":"Funnel","type":"funnel","left":"10%","top":60,"bottom":60,"width":"80%","min":0,"max":100,"minSize":"0%","maxSize":"100%","sort":"descending","gap":2,"label":{"show":true,"position":"inside"},"labelLine":{"length":10,"lineStyle":{"width":1,"type":"solid"}},"itemStyle":{"borderColor":"#fff","borderWidth":1},"emphasis":{"label":{"fontSize":20}},"data":[{"value":60,"name":"Visit"},{"value":40,"name":"Inquiry"},{"value":20,"name":"Order"},{"value":80,"name":"Click"},{"value":100,"name":"Show"}]}]}
`