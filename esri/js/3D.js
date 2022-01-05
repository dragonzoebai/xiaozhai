require([
	"esri/Map",
	"esri/views/SceneView",
	"esri/layers/TileLayer",
	"esri/layers/FeatureLayer",
	"esri/layers/MapImageLayer"
], function(Map, SceneView, TileLayer, FeatureLayer, MapImageLayer) {

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
				//style: "italic",
				weight: "normal"
			}
		},
		labelPlacement: "above-center",
		labelExpressionInfo: {
			expression: "$feature.Name"
		}
	};

	var featureLayer = new FeatureLayer({
		url: arcgisIP + "services/xiaozhaimap_dark/MapServer/37",
		//renderer: bikeTrailsRenderer,
		labelingInfo: [trailheadsLabels],
		//definitionExpression: "objectid <100",
		//screenSizePerspectiveEnabled :true
	});
	var mapImageLayer = new MapImageLayer({
		url: arcgisIP + "services/xiaozhaimap_dark/MapServer"
	});

	// 管网图层

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
		type: "line-3d", // autocasts as new LineSymbol3D()
		symbolLayers: [{
			type: "path", // autocasts as new PathSymbol3DLayer()
			profile: "circle", // creates a rectangular shape
			size: 20, // path width will also set the height to the same value
			material: {
				color: "#ff0000"
			},
			cap: "round"
		}]
	};

	const type2 = {
		type: "line-3d", // autocasts as new LineSymbol3D()
		symbolLayers: [{
			type: "path", // autocasts as new PathSymbol3DLayer()
			profile: "circle", // creates a rectangular shape
			size: 20, // path width will also set the height to the same value
			material: {
				color: "#00ff00"
			},
			cap: "round"
		}]
	};

	const type3 = {
		type: "line-3d", // autocasts as new LineSymbol3D()
		symbolLayers: [{
			type: "path", // autocasts as new PathSymbol3DLayer()
			profile: "circle", // creates a rectangular shape
			size: 20, // path width will also set the height to the same value
			material: {
				color: "#ffff00"
			},
			cap: "round"
		}]
	};

	var pipe_network_renderer = {
		type: "unique-value",
		field: "NetTypeNo",
		defaultSymbol: {
			type: "line-3d", // autocasts as new LineSymbol3D()
			symbolLayers: [{
				type: "path", // autocasts as new PathSymbol3DLayer()
				profile: "circle", // creates a rectangular shape
				size: 20, // path width will also set the height to the same value
				material: {
					color: "#ff7380"
				},
				cap: "round"
			}]
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
		}],
		visualVariables: [{
			type: "size",
			field: "Diameter",
			valueUnit: "meters" // Converts and extrudes all data values in meters
		}]
	};

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
		elevationInfo: {
			mode: "relative-to-ground",
			offset: 1
		},
		renderer: pipe_network_renderer,
		labelingInfo: [pipe_network_labels],
		popupTemplate: template
	});

	//建筑矢量图层
	var renderer = {
	  type: "unique-value", // autocasts as new UniqueValueRenderer()
	  defaultSymbol: {
		type: "polygon-3d", // autocasts as new PolygonSymbol3D()
		symbolLayers: [
		  {
			type: "extrude", // autocasts as new ExtrudeSymbol3DLayer()
			material: {
			  color: "#b4e0ff"
			},
			edges: {
			  type: "solid",
			  color: "#70a8cf",
			  size: 0.5
			}
		  }
		]
	  },
	  visualVariables: [
		{
		  type: "size",
		  field: "height",
		  valueUnit: "feet" // "unknown","inches", "feet", "yards", "miles", "nautical-miles", "millimeters", "centimeters", "decimeters", "meters", "kilometers", "decimal-degrees"
		}
	  ]
	};
	var featureLayerBuilding = new FeatureLayer({
		url: arcgisIP + "services/xiaozhaimap_dark/MapServer/48",
		renderer: renderer,
		// maxScale: 4000,
		minScale: 10000
	});

	var map = new Map({
		//basemap: "streets"
	});
	map.add(myTileLayer);
	// map.add(mapImageLayer);
	map.add(mx_pipe_network_properties);
	map.add(featureLayerBuilding);

	var view = new SceneView({
		container: "viewDiv",
		map: map,
		camera: {
			position: { // observation point
				x: 108.94163758492394,
				y: 34.22611119818822,
				z: 30 // altitude in meters
			},
			tilt: 75, // perspective in degrees
			heading: 25
		}
	});
	view.when(() => {
		console.log("地图加载完成");
		view.on("click", (event) => {
			console.log(view.camera)
			view.hitTest(event).then((response) => {
				const feature = response.results[0].graphic;
				console.log(feature)
				// 根据图层id执行相应事件
				if (feature.layer.id == "mx_pipe_network_properties") {
					console.log("id: " + feature.attributes.id)
				}
			})
		});
	}, (error) => {
		console.error("错误: ", error);
	});
});
