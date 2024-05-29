const GAMEMASTERS = [
  { id: 1, name: "John", trained_rooms: [2, 3] },
  { id: 2, name: "Alice", trained_rooms: [4, 10] },
  { id: 3, name: "David", trained_rooms: [5] },
  { id: 4, name: "Emily", trained_rooms: [8, 6, 2, 7] },
  { id: 5, name: "Michael", trained_rooms: [9, 1, 4, 3, 11, 8, 6, 12] },
  { id: 6, name: "Sophia", trained_rooms: [7, 10] },
  { id: 7, name: "Daniel", trained_rooms: [8] },
  { id: 8, name: "Olivia", trained_rooms: [3, 9] },
  { id: 9, name: "Matthew", trained_rooms: [2, 6, 1, 7, 3, 4] },
  { id: 10, name: "Emma", trained_rooms: [5, 4] },
  { id: 11, name: "James", trained_rooms: [11] },
  { id: 12, name: "Isabella", trained_rooms: [7, 4, 12] },
  { id: 13, name: "William", trained_rooms: [11] },
  { id: 14, name: "Ava", trained_rooms: [9] },
  { id: 15, name: "Benjamin", trained_rooms: [8, 4] },
  { id: 16, name: "Mia", trained_rooms: [1, 3, 7, 5, 8] },
  { id: 17, name: "Ethan", trained_rooms: [4, 2] },
  { id: 18, name: "Charlotte", trained_rooms: [10] },
  { id: 19, name: "Alexandre", trained_rooms: [9, 2, 8] },
  { id: 20, name: "Harper", trained_rooms: [1, 12] },
];

const ROOMS = [
  { id: 1, name: "Le Braquage à la francaise" },
  { id: 2, name: "Le Braquage de casino" },
  { id: 3, name: "L'Enlèvement" },
  { id: 4, name: "Le Métro" },
  { id: 5, name: "Les Catacombes" },
  { id: 6, name: "Assassin's Creed" },
  { id: 7, name: "L'Avion" },
  { id: 8, name: "La Mission spatiale" },
  { id: 9, name: "Le Tremblement de terre" },
  { id: 10, name: "Le Cinéma hanté" },
  { id: 11, name: "Le Farwest" },
  { id: 12, name: "Mission secrète" },
];

// Tirage aléatoire des gamemasters
const random_gamemaster_array = (size) =>
  GAMEMASTERS.sort(() => Math.random() - 0.5).slice(0, size);

// sorted gamemaster
const sortedGM = (gamemasters) => {
  gamemasters.sort((a, b) => a.trained_rooms.length - b.trained_rooms.length);
};

// check if room is setted
const isSettedRoom = (attributed_room, roomId) => {
  return attributed_room.find((item) => item.roomId === roomId);
};

// check if game is setted
const isSettedGame = (attributed_room, gmId) => {
  return attributed_room.find((item) => item.gmId === gmId);
};

// if gamemaster only have 1 room => attribute room
const attributeOneRoom = (attributed_room, gamemasters) => {
  let check_error = false;

  gamemasters.forEach((gm) => {
    if (gm.trained_rooms.length === 0) {
      console.log("Error: No Room to set");
      check_error = true;
      return;
    } else if (gm.trained_rooms.length === 1) {
      if (
        !isSettedRoom(attributed_room, gm.trained_rooms[0]) &&
        !isSettedGame(attributed_room, gm.id)
      ) {
        attributed_room.push({
          roomId: gm.trained_rooms[0],
          gmId: gm.id,
          gmName: gm.name,
        });
      } else {
        console.log(`Error: Room ${gm.trained_rooms[0]} is already set`);
        check_error = true;
        return;
      }
    }
  });
  if (check_error) return false;
  else return true;
};

// after finish attribute 1 room, check if there are rooms that show only once
const getConcurrenceRoom = (total_room, attributed_room, gamemasters) => {
  const concurrence_room = {};
  let check_error = false;

  // check concurrence
  gamemasters.forEach((gm) => {
    gm.trained_rooms.forEach((roomId) => {
      if (!isSettedRoom(attributed_room, roomId)) {
        if (!concurrence_room[roomId]) {
          concurrence_room[roomId] = 1;
        } else {
          concurrence_room[roomId] = concurrence_room[roomId] + 1;
        }
      }
    });
  });

  // if there are no room show once
  if (!Object.values(concurrence_room).includes(1)) {
    // I used loop to check all the posibility
    gamemasters[0].trained_rooms.forEach((item) => {
      gamemasters[0].trained_rooms = [item];
      //   console.log("check", gamemasters);
      gameRec(total_room, gamemasters, attributed_room);
    });
  } else {
    // if there are room show once
    for (const [key, value] of Object.entries(concurrence_room)) {
      if (value === 1) {
        const index = gamemasters.find((item) =>
          item.trained_rooms.includes(Number(key))
        );
        if (!isSettedGame(attributed_room, index.id)) {
          attributed_room.push({
            roomId: Number(key),
            gmId: index.id,
            gmName: index.name,
          });
        } else {
          console.log(
            `Error: Gamemasters ${index.id} - ${index.name} is already set`
          );
          check_error = true;
          return;
        }
      }
    }
  }
  if (check_error) return false;
  else return true;
};

const gameRec = (total_room, gamemasters, attributed_room) => {
  // sort trained_room in gamemasters
  sortedGM(gamemasters);

  // check when game master have only 1 room
  const res = attributeOneRoom(attributed_room, gamemasters);

  // check when room shows once
  if (res) {
    const res_concurrence = getConcurrenceRoom(
      total_room,
      attributed_room,
      gamemasters
    );

    // if the room doesn't finish attribute => do recursive
    if (res_concurrence) {
      if (attributed_room.length < total_room) {
        const new_gm = [];
        gamemasters.forEach((item) => {
          if (!isSettedGame(attributed_room, item.id)) {
            // create new trained room that doesn't have setted room
            const new_trained_room = item.trained_rooms.filter(
              (item) => !isSettedRoom(attributed_room, item)
            );
            new_gm.push({
              id: item.id,
              name: item.name,
              trained_rooms: new_trained_room,
            });
          }
        });
        gameRec(total_room, new_gm, attributed_room);
      }
    }
  } else return [];
};

const showResultat = (attributed_room, ROOMS, rooms) => {
  if (attributed_room.length !== ROOMS.length) {
    console.log("Le tirage est impossible");
  } else {
    console.log("Le tirage est possible");
    const new_session = attributed_room.map((item) => {
      const index_room = rooms.find((r) => r.id === item.roomId);
      return {
        room: index_room,
        gamemaster: { id: item.gmId, name: item.gmName },
      };
    });
    new_session.sort((a, b) => a.room.id - b.room.id);
    console.log(new_session);
  }
};

const main = () => {
  const gamemasters = random_gamemaster_array(ROOMS.length);
  //   const sessions = ROOMS.map((room) => {
  //     return { room: room };
  //   });
  const rooms = ROOMS.slice();

  console.log("Subject");
  console.log(gamemasters);

  const attributed_room = [];
  console.log("\n\nRunning test");
  gameRec(ROOMS.length, gamemasters, attributed_room);

  console.log("\n\nCONCLUSION");
  showResultat(attributed_room, ROOMS, rooms);

  /* TODO
    Tu vas devoir attribuer à chaque session un gamemaster en fonction des salles sur lesquelles il est déjà formé.
    Chaque gamemaster ne peut être attribué qu'à une seule session.
    Tu as quartier libre sur la methode, l'objectif ici est de voir comment tu travailles et comment tu te confrontes à ce genre de problème.
    Si le tirage est impossible, tu devras signaler le problème. Sinon tu devras afficher une des solutions.

    /!\ L'annonce stipule que nous cherchons un développeur senior.
    */

  /*     Code explication
    Dans ce test, j'utilise une approche récursive pour attribuer les gamemasters à chaque salle.
    Dans chaque récursive, je attribué tous d'abord des gamemasters qui a une salle.
    Puis je trouve des concurrences des salles de tous les gamemasters:
  	    - Si il y a une salle qui a concurrence égale 1 => attribuer 
        - Sinon, je fais un boucle sur les salles de la première gamemaster et refaire la récursive
  */
};

main();
