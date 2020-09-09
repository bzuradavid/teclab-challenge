var app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
        alertDialog: {
          title: null,
          text: null,
          show: null
        },
        menuDate: false,
        menuTimeFrom: false,
        menuTimeTo: false,
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
          { text: 'Acción', value: 'action', align: 'center', sortable: false },
        ],
    } 
  },

  mounted() {
    this.container = document.getElementById('visualization');
    this.items = new vis.DataSet([
      {
        id: 1,
        content: "Alvarado, Eduardo Alfonso",
        start: new Date().toISOString().substr(0, 10) + " 09:30",
        end: new Date().toISOString().substr(0, 10) + " 10:30"
      },
      {
        id: 2,
        content: "Acuña López, Juliana",
        start: new Date().toISOString().substr(0, 10) + " 11:00",
        end: new Date().toISOString().substr(0, 10) + " 12:30"
      },
      {
        id: 3,
        content: "Arenales, Ingrid Lorena",
        start: new Date().toISOString().substr(0, 10) + " 12:30",
        end: new Date().toISOString().substr(0, 10) + " 13:30"
      },
      {
        id: 4,
        content: "Barreto Ruíz, Aldana",
        start: new Date().toISOString().substr(0, 10) + " 13:30",
        end: new Date().toISOString().substr(0, 10) + " 16:00"
      },
      {
        id: 5,
        content: "Buitrago Lozano, Daniel Esteban",
        start: new Date().toISOString().substr(0, 10) + " 16:30",
        end: new Date().toISOString().substr(0, 10) + " 17:30"
      },
      {
        id: 6,
        content: "Delgado, Ángel David",
        start: new Date().toISOString().substr(0, 10) + " 17:30",
        end: new Date().toISOString().substr(0, 10) + " 19:00"
      }
      
    ]);
    this.options = {
      selectable: false,
      editable: false,
      stack: false,
      orientation: {
        axis: "top",
        item: "top"
      },
      //zoomMax: 31536000000, // just one year
      zoomMax: 87600900, // 10,000 years is maximum possible
      zoomMin: 10000000 // 10ms
    };
    this.timeline = new vis.Timeline(this.container, this.items, this.options);
    this.reset()
    this.update();
  },

  methods: {
    allowedStep: m => m % 15 === 0,
    showAlert(title, text) {
      this.alertDialog = {
        title: title,
        text: text,
        show: true
      }
    },
    validateAvailability(newItem){
      let slotAvailable = true;
      this.items.forEach(item => {
        if (item.start < newItem.start) {
          if (item.end > newItem.start) {
            slotAvailable = false;
          }
        } else {
          if (item.start < newItem.end) {
            slotAvailable = false;
          }
        }
      })
      return slotAvailable;
    },
    saveItem() {
      let latestItem = this.items.max('id');
      let currentId = latestItem ? latestItem.id + 1 : 1;
      let formattedContent = this.currentItem.content;
      let formattedStart = this.currentItem.date + " " + this.currentItem.timeFrom;
      let formattedEnd = this.currentItem.date + " " + this.currentItem.timeTo;
      let formattedItem = {
        id: currentId,
        content: formattedContent,
        start: formattedStart,
        end: formattedEnd,
        className: 'my-item'
      }
      if (!this.currentItem.content) {
        this.showAlert('Campo requerido', 'Debe ingresar su Nombre para completar la reserva');
        return;
      }
      if (this.validateAvailability(formattedItem)) {
        this.items.add(formattedItem);
        this.reset()
        this.update();
      } else {
        this.showAlert('La franja seleccionada no se encuentra disponible', 'Por favor seleccione otra franja horaria');
      }
    },
    deleteItem(itemId){
      this.items.remove(itemId);
      this.update();
    },
    reset() {
      let date = new Date();
      let h = this.addZero(date.getHours());
      let m = this.addZero(date.getMinutes());
      let _h = this.addZero(date.getHours()+1);
      let initialDate = date.toISOString().substr(0, 10);
      let initialTimeFrom = `${h}:${m}`;
      let initialTimeTo = `${_h}:${m}`;
      this.currentItem.date = initialDate;
      this.currentItem.timeFrom = initialTimeFrom;
      this.currentItem.timeTo = initialTimeTo;
      this.currentItem.content = '';
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
    },
    addZero(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    move(percentage) {
      var range = this.timeline.getWindow();
      var interval = range.end - range.start;
      this.timeline.setWindow({
        start: range.start.valueOf() - interval * percentage,
        end: range.end.valueOf() - interval * percentage
      });
    }
  }
})
