var app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
        currentItem: {
          content: null,
          date: null,
          timeFrom: null,
          timeTo: null
        },
        items: [],
        options: {},
        container: '',
        formattedItems: [],
        headers: [
          { text: 'Nombre', value: 'name' },
          { text: 'Horario', value: 'time', align: 'right' },
          { text: 'Accion', value: 'action', align: 'center', sortable: false },
        ],
    } 
  },

  mounted() {
    this.container = document.getElementById('visualization');
    this.items = new vis.DataSet([
      {
        id: 1,
        content: "Javier Koraj",
        start: "2020-09-9 10:00",
        end: "2020-09-9 10:30"
      },
      {
        id: 2,
        content: "Alexander Fleitas",
        start: "2020-09-9 11:00",
        end: "2020-09-9 11:45"
      }
    ]);
    this.options = {
      //stack: false,
      orientation: {
        axis: "top",
        item: "top"
      },
      //zoomMax: 31536000000, // just one year
      zoomMax: 87600900, // 10,000 years is maximum possible
      zoomMin: 10000000 // 10ms
    };
    this.timeline = new vis.Timeline(this.container, this.items, this.options);
    let unformattedItems = this.items.get();
    this.formattedItems = this.formatData(unformattedItems);
  },

  methods: {
    saveItem() {
      let currentId = this.items.length + 1;
      let formattedContent = this.currentItem.content;
      let formattedStart = this.currentItem.date + " " + this.currentItem.timeFrom;
      let formattedEnd = this.currentItem.date + " " + this.currentItem.timeTo;
      let formattedItem = {
        id: currentId,
        content: formattedContent,
        start: formattedStart,
        end: formattedEnd
      }
      this.items.add(formattedItem);
      this.update();
    },
    deleteItem(itemId){
      console.log(itemId);
      this.items.remove(itemId);
      this.update();
    },
    update(){
      let unformattedItems = this.items.get();
      this.formattedItems = this.formatItems(unformattedItems);
    },
    formatItems(data) {
      let formattedArray = data.map(item => {
        let start = item.start.split(" ");
        let end = item.end.split(" ");
        let formattedTime = `de ${start[1]} a ${end[1]}`;
        let formattedItem = {
          id: item.id,
          name: item.content,
          time: formattedTime
        }
        return formattedItem;
      })
      return formattedArray;
    }
  }
})

// // create a timeline with some data
// var container = document.getElementById("visualization");
// var items = new vis.DataSet([
//   {
//     id: 1,
//     content: "Reserva 1",
//     start: "2020-09-9 10:00",
//     end: "2020-09-9 10:30"
//   },
//   {
//     id: 2,
//     content: "Reserva 2",
//     start: "2020-09-9 11:00",
//     end: "2020-09-9 11:45"
//   }
// ]);
// var options = {
//   //stack: false,
//   orientation: {
//     axis: "top",
//     item: "top"
//   },
//   //zoomMax: 31536000000, // just one year
//   zoomMax: 87600900, // 10,000 years is maximum possible
//   zoomMin: 10000000 // 10ms
// };
// var timeline = new vis.Timeline(container, items, options);

// /**
//      * Move the timeline a given percentage to left or right
//      * @param {Number} percentage   For example 0.1 (left) or -0.1 (right)
//      */
// function move(percentage) {
//   var range = timeline.getWindow();
//   var interval = range.end - range.start;
//   timeline.setWindow({
//     start: range.start.valueOf() - interval * percentage,
//     end: range.end.valueOf() - interval * percentage
//   });
// }

// // attach events to the navigation buttons
// document.getElementById("moveLeft").onclick = function() {
//   move(0.2);
// };
// document.getElementById("moveRight").onclick = function() {
//   move(-0.2);
// };

// // Using slider to zoomIn or zoomOut
// document.getElementById("sliderZoom").addEventListener("input", function(e) {
//   var value = this.value;
//   if (value < 0) {
//     var start = moment().year(moment().year() - 100000), // to adjust with options
//       end = moment().year(moment().year() + 1);
//     timeline.zoomOut(-value);
//     if (value === "-1") timeline.setWindow(start, end);
//   } else if (value > 0) {
//     var start = moment(), end = moment(moment().utc() + 10);
//     timeline.zoomIn(value);
//     if (value === "1") timeline.setWindow(start, end);
//   } else {
//     timeline.fit(items.getIds());
//     this.value = 0;
//   }
// });

// // To reset zoom initial state
// document.getElementById("fit").onclick = function() {
//   //$('.range').next().text('0'); // set default if to use output with input range
//   document.getElementById("sliderZoom").value = 0;
//   timeline.fit(items.getIds());
// };
