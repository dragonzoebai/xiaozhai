require([
	"esri/Map",
	"esri/views/MapView",
	"esri/layers/TileLayer",
	"esri/layers/FeatureLayer",
	"esri/layers/MapImageLayer"
], function(Map, MapView, TileLayer, FeatureLayer, MapImageLayer) {

	var arcgisIP = "https://xz.csceccloud.net:10000/arcgis/rest/";
	var myTileLayer = new TileLayer({
		url: arcgisIP + "services/xiaozhaimap_dark/MapServer",
	});
	var bikeTrailsRenderer = {
		type: "simple",
		symbol: {
			type: "picture-marker",
			url: "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
			width: "18px",
			height: "18px"
		}
	};
	var trailheadsLabels = {
		symbol: {
			type: "text",
			color: "#FFFFFF",
			haloColor: "#5E8D74",
			haloSize: "2px",
			font: {
				size: "12px",
				family: "Noto Sans",
				style: "italic",
				weight: "normal"
			}
		},
		labelPlacement: "above-center",
		labelExpressionInfo: {
			expression: "$feature.Name"
		}
	};

	var pipe_network_labels = {
		symbol: {
			type: "text",
			color: "#FFFFFF",
			haloColor: "#5E8D74",
			haloSize: "2px",
			font: {
				size: "12px",
				family: "Noto Sans",
				style: "italic",
				weight: "normal"
			}
		},
		labelPlacement: "above-center",
		labelExpressionInfo: {
			expression: "$feature.id"
		}
	};

	const type1 = {
		type: "simple-line", // autocasts as new SimpleFillSymbol()
		color: "#ff0000",
		width: "1px"
	};

	const type2 = {
		type: "simple-line", // autocasts as new SimpleFillSymbol()
		color: "#00ff00",
		width: "1px"
	};

	const type3 = {
		type: "simple-line", // autocasts as new SimpleFillSymbol()
		color: "#ffff00",
		width: "1px"
	};

	/**
	var pipe_network_renderer = {
		type: "class-breaks",
		field: "NetTypeNo",
		defaultSymbol: {
			type: "simple-line",
			color: "#FF0000",
			width: "1px"
		},
		classBreakInfos: [{
				minValue: 1,
				maxValue: 1,
				symbol: type1
			},{
				minValue: 2,
				maxValue: 2,
				symbol: type2
			},{
				minValue: 3,
				maxValue: 3,
				symbol: type3
			}
		]
	};
	**/

	var pipe_network_renderer = {
		type: "unique-value",
		field: "NetTypeNo",
		defaultSymbol: {
			type: "simple-line",
			color: "#FF0000",
			width: "1px"
		},
		uniqueValueInfos: [{
			value: 1,
			symbol: type1
		}, {
			value: 2,
			symbol: type2
		}, {
			value: 3,
			symbol: type3
		}]
	};

	// 道路图层
	var featureLayer = new FeatureLayer({
		url: arcgisIP + "services/xiaozhaimap_dark/MapServer/37",
		// renderer: bikeTrailsRenderer,
		labelingInfo: [trailheadsLabels]
	});
	var mapImageLayer = new MapImageLayer({
		url: arcgisIP + "services/xiaozhaimap_dark/MapServer"
	});

	// 管网图层
	const template = {
		title: "{id}",
		content: [{
			type: "fields",
			fieldInfos: [{
					fieldName: "id",
					label: "id"
				},
				{
					fieldName: "Length",
					label: "长度",
					format: {
						digitSeparator: true,
						places: 0
					}
				}
			]
		}]
	};
	var mx_pipe_network_properties = new FeatureLayer({
		id: "mx_pipe_network_properties",
		url: arcgisIP + "services/xiaozha/mx_pipe_network_properties/MapServer/0",
		renderer: pipe_network_renderer,
		labelingInfo: [pipe_network_labels],
		// popupTemplate: template
	});

	var map = new Map({
		//basemap: "streets"
	});
	map.add(myTileLayer);
	// map.add(featureLayer);
	map.add(mx_pipe_network_properties);
	// map.add(mapImageLayer);

	var view = new MapView({
		container: "viewDiv",
		map: map,
		center: [108.948301, 34.223445], // longitude, latitude
		zoom: 3
	});
	view.when(() => {
		console.log("地图加载完成");
		view.on("click", (event) => {
			view.hitTest(event).then((response)=> {
				const feature = response.results[0].graphic;
				// console.log(feature)
				// 根据图层id执行相应事件
				if(feature.layer.id=="mx_pipe_network_properties"){
					console.log("id: "+feature.attributes.id)
				}
			})
		});
	}, (error) => {
		console.error("错误: ", error);
	});

});
