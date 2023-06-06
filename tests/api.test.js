process.env.ENV = "test";
process.env.PORT = 3001;

let mongoose = require("mongoose");
const { server } = require("../libs");
const request = require("supertest");
const { giveAdminAccess } = require("../libs/service/auth.service");
let accessToken;
let userAccessToken;
let movieActor;
let theatre;

afterAll(() => {
  mongoose.connection.close();
  mongoose.connection.db.dropDatabase();
  server.close();
});

describe("Testing Authentication API", () => {
  it("should create new user which will later become admin", async () => {
    const body = {
      firstName: "Zaid",
      lastName: "Khan",
      email: "zdkhan07861@gmail.com",
      loginId: "triquetrx",
      password: "test123",
      confirmPassword: "test123",
      contactNumber: "8767860091",
    };
    const res = await request(server)
      .post("/api/v1.0/moviebooking/register")
      .send(body);
    expect(res.statusCode).toBe(201);
  });

  it("should give admin access to first user created", async () => {
    const res = await giveAdminAccess("triquetrx");
    expect(res).toBe("Admin access provided to triquetrx");
  });

  it("should create new user", async () => {
    const body = {
      firstName: "Test",
      lastName: "User",
      email: "user@test.com",
      loginId: "test",
      password: "test123",
      confirmPassword: "test123",
      contactNumber: "1234567890",
    };
    const res = await request(server)
      .post("/api/v1.0/moviebooking/register")
      .send(body);
    expect(res.statusCode).toBe(201);
  });

  it("should throw an error as user already exists", async () => {
    const body = {
      firstName: "Zaid",
      lastName: "Khan",
      email: "zdkhan07861@gmail.com",
      loginId: "triquetrx",
      password: "test123",
      confirmPassword: "test123",
      contactNumber: "8767860091",
    };
    const res = await request(server)
      .post("/api/v1.0/moviebooking/register")
      .send(body);
    expect(res.body.message).toMatch(/(email: Email ID must be unique)/i);
    expect(res.body.message).toMatch(/(loginId: User ID already taken)/i);
  });

  it("should allow admin user to login", async () => {
    const body = {
      loginId: "triquetrx",
      password: "test123",
    };
    const res = await request(server)
      .post("/api/v1.0/moviebooking/login")
      .send(body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("payload");
    accessToken = res.body.payload;
  });

  it("should allow user to login via email ID", async () => {
    const body = {
      email: "user@test.com",
      password: "test123",
    };
    const res = await request(server)
      .post("/api/v1.0/moviebooking/login")
      .send(body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("payload");
    userAccessToken = res.body.payload;
  });

  it("should not allow login with wrong credentials", async () => {
    const body = {
      loginId: "triquetrx",
      password: "test1234",
    };
    const res = await request(server)
      .post("/api/v1.0/moviebooking/login")
      .send(body);
    expect(res.statusCode).toBe(401);
  });
});

describe("Testing Theatre API", () => {
  it("should add new theatre", async () => {
    const body = {
      theatreName: "PVR Thane",
      city: "Thane",
      seats: 2200,
      cost: 250,
    };
    const res = await request(server)
      .post("/api/v1.0/moviebooking/add-new-theatre")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(body);
    expect(res.statusCode).toBe(201);
  });

  it("should throw an error as theatre name already exists", async () => {
    const body = {
      theatreName: "PVR Thane",
      city: "Thane",
      seats: 2200,
      cost: 250,
    };
    const res = await request(server)
      .post("/api/v1.0/moviebooking/add-new-theatre")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(body);
    expect(res.body.message).toMatch(/(duplicate key error collection)/i);
  });

  it("should return all the theatres", async () => {
    const res = await request(server).get("/api/v1.0/moviebooking/all-theatre");
    expect(res.status).toBe(200);
    theatre = res.body.payload[0];
    expect(res.body.payload.length).toBe(1);
  });
});

describe("Testing Actors API", () => {
  it("should add the actor", async () => {
    const body = {
      actorName: "Florence Pugh",
      actorPhotoLink:
        "https://images.hellomagazine.com/horizon/square/d68ccb8a2f0e-florence-pugh-boy-band-hair-t.jpg",
    };
    const res = await request(server)
      .post("/api/v1.0/moviebooking/add-actor")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(body);
    expect(res.status).toBe(201);
  });

  it("shouldn't allow to add the actor with wrong token", async () => {
    const body = {
      actorName: "Tom Cruise",
      actorPhotoLink:
        "https://images.hellomagazine.com/horizon/square/d68ccb8a2f0e-florence-pugh-boy-band-hair-t.jpg",
    };
    const res = await request(server)
      .post("/api/v1.0/moviebooking/add-actor")
      .set("Authorization", `Bearer ${accessToken}1234`)
      .send(body);
    expect(res.status).toBe(401);
  });

  it("should show all the actors in Database", async () => {
    const res = await request(server).get("/api/v1.0/moviebooking/all-actors");
    movieActor = res.body.payload[0];
    expect(res.status).toBe(200);
  });
});

describe("Testing Movies API", () => {
  it("should return all the movies in the db using /GET request", async () => {
    const res = await request(server).get("/api/v1.0/moviebooking/all");
    expect(res.status).toBe(200);
  });

  it("shouldn't allow to add the movies in the db", async () => {
    const body = {
      movieName: "Test Movie",
      starring: [movieActor._id],
      moviePosterLink:
        "https://pbs.twimg.com/media/FvUVt3hXgAAxP1H?format=jpg&name=900x900",
      releaseDate: "2023-07-21",
    };
    const res = await request(server)
      .post("/api/v1.0/moviebooking/add-new-movie")
      .set("Authorization", `Bearer ${accessToken}1234`)
      .send(body);
    expect(res.statusCode).toBe(401);
  });

  it("should allow to add the movies in the db", async () => {
    const body = {
      movieName: "Test Movie",
      starring: [movieActor._id],
      shows: [
        {
          theatreId: theatre._id,
          showDetails: [
            {
              showTime: "9:00",
              seats: 180,
            },
            {
              showTime: "12:00",
              seats: 200,
            },
            {
              showTime: "15:00",
              seats: 150,
            },
            {
              showTime: "18:00",
              seats: 100,
            },
          ],
        },
      ],
      moviePosterLink:
        "https://pbs.twimg.com/media/FvUVt3hXgAAxP1H?format=jpg&name=900x900",
      releaseDate: "2023-07-21",
    };
    const res = await request(server)
      .post("/api/v1.0/moviebooking/add-new-movie")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(body);
    expect(res.statusCode).toBe(201);
  });

  it("shouldn't allow to add the movies in the db as it already exists", async () => {
    const body = {
      movieName: "Test Movie",
      starring: [movieActor._id],
      shows: [
        {
          theatreId: theatre._id,
          showDetails: [
            {
              showTime: "9:00",
              seats: 180,
            },
            {
              showTime: "12:00",
              seats: 200,
            },
            {
              showTime: "15:00",
              seats: 150,
            },
            {
              showTime: "18:00",
              seats: 100,
            },
          ],
        },
      ],
      moviePosterLink:
        "https://pbs.twimg.com/media/FvUVt3hXgAAxP1H?format=jpg&name=900x900",
      releaseDate: "2023-07-21",
    };
    const res = await request(server)
      .post("/api/v1.0/moviebooking/add-new-movie")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(body);
    expect(res.statusCode).toBe(400);
  });

  it("should book movie ticket", async () => {
    const body = {
      theatreId: theatre._id,
      showTime: "12:00",
      numberOfTickets: 2,
      seatNumbers: ["A2", "A4"],
    };

    const res = await request(server)
      .post("/api/v1.0/moviebooking/Test Movie/add")
      .set("Authorization", `Bearer ${userAccessToken}`)
      .send(body);

    expect(res.statusCode).toBe(201);
    expect(res.body.payload.message).toBe("Booking Confirmed");
  });

  it("should show all the bookings by the user", async () => {
    const res = await request(server)
      .get("/api/v1.0/moviebooking/my-bookings")
      .set("Authorization", `Bearer ${userAccessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.payload[0]).toHaveProperty("movieName");
    expect(res.body.payload[0].movieName).toBe("Test Movie");
  });

  it("shouldn't allow to book as number of seats doesn't match the seat numbers array length", async () => {
    const body = {
      theatreId: theatre._id,
      showTime: "12:00",
      numberOfTickets: 1,
      seatNumbers: ["A2", "A4"],
    };

    const res = await request(server)
      .post("/api/v1.0/moviebooking/Test Movie/add")
      .set("Authorization", `Bearer ${userAccessToken}`)
      .send(body);

    expect(res.statusCode).toBe(400);
  });

  it("shouldn't allow to book as theatre ID is wrong", async () => {
    const body = {
      theatreId: "11111123abcd",
      showTime: "12:00",
      numberOfTickets: 1,
      seatNumbers: ["A2", "A4"],
    };

    const res = await request(server)
      .post("/api/v1.0/moviebooking/Test Movie/add")
      .set("Authorization", `Bearer ${userAccessToken}`)
      .send(body);

    expect(res.statusCode).toBe(400);
  });

  it("shouldn't allow to book as Auth token is malformed", async () => {
    const body = {
      theatreId: "11111123abcd",
      showTime: "12:00",
      numberOfTickets: 1,
      seatNumbers: ["A2", "A4"],
    };

    const res = await request(server)
      .post("/api/v1.0/moviebooking/Test Movie/add")
      .set("Authorization", `Bearer ${userAccessToken}12345`)
      .send(body);

    expect(res.statusCode).toBe(401);
  });

  it("should allow to increase the number of seats for the show", async () => {
    const body = {
      type: "ADD",
      theatreId: theatre._id,
      showTime: "12:00",
      numberOfSeats: 50,
    };
    const res = await request(server)
      .put("/api/v1.0/moviebooking/Test Movie/update")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(body);

    expect(res.statusCode).toBe(202);
  });

  it("should allow to decrease the number of seats for the show", async () => {
    const body = {
      type: "DELETE",
      theatreId: theatre._id,
      showTime: "12:00",
      numberOfSeats: 20,
    };
    const res = await request(server)
      .put("/api/v1.0/moviebooking/Test Movie/update")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(body);

    expect(res.statusCode).toBe(202);
  });

  it("should allow to delete the movie", async () => {
    const res = await request(server)
      .delete("/api/v1.0/moviebooking/Test Movie/delete")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(202);
  });
});
