import * as THREE from "three";

class SimpleZombieLogic {
  constructor() {
    this.position = new THREE.Vector3(); // Posición inicial
    this.direction = new THREE.Vector3(); // Dirección de movimiento
    this.state = "patrolling"; // Estado inicial del zombie
    this.health = 100; // Salud inicial
    this.speed = 0.02; // Velocidad de patrullaje
    this.detectDistance = 8; // Distancia de detección
    this.attackDistance = 1; // Distancia de ataque
    this.growlCooldown = 5000; // Tiempo entre gruñidos
    this.lastGrowlTime = 0; // Registro del último gruñido
    this.animation = "Armature|Walk"; // Animación inicial
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z);
  }

  setDirection(direction) {
    this.direction.copy(direction);
  }

  patrol() {
    this.position.add(this.direction.clone().multiplyScalar(this.speed));
  }

  chasePlayer(playerPosition) {
    const directionToPlayer = new THREE.Vector3()
      .subVectors(playerPosition, this.position)
      .normalize();
    this.position.add(directionToPlayer.multiplyScalar(this.speed * 1.5)); // Velocidad aumentada al perseguir
  }

  receiveDamage(damage) {
    this.health = Math.max(0, this.health - damage);
    if (this.health <= 0) {
      this.state = "dying";
    }
  }

  growl() {
    const currentTime = Date.now();
    if (currentTime - this.lastGrowlTime > this.growlCooldown) {
      console.log("Zombie growls!");
      this.lastGrowlTime = currentTime;
      // Aquí podrías agregar lógica para cambiar animaciones
    }
  }

  update(playerPosition) {
    const distanceToPlayer = this.position.distanceTo(playerPosition);

    switch (this.state) {
      case "patrolling":
        this.growl(); // Gruñido en patrullaje
        if (distanceToPlayer < this.detectDistance) {
          this.state = "chasing";
        } else {
          this.patrol();
        }
        break;

      case "chasing":
        if (distanceToPlayer < this.attackDistance) {
          this.state = "attacking";
        } else if (distanceToPlayer > this.detectDistance) {
          this.state = "patrolling";
        } else {
          this.chasePlayer(playerPosition);
        }
        break;

      case "attacking":
        // Lógica de ataque puede ser implementada aquí
        if (distanceToPlayer > this.attackDistance) {
          this.state = "chasing";
        }
        break;

      case "dying":
        console.log("Zombie has died.");
        // Aquí podrías implementar la lógica de muerte
        break;

      default:
        break;
    }

    if (distanceToPlayer < this.attackDistance) {
      console.log("close to player");

      if (this.animation === "Armature|Attack") {
        if (actions[animation].time > 0.9 && actions[animation].time < 1.2) {
          console.log("Attacking player");
          setPlayerHealth((prevHealth) => prevHealth - 1); // Dañar al jugador
          setHitReceived(true);
          setTimeout(() => setHitReceived(false), 1000);
        }
      }

      if (controller.curAnimation === "CharacterArmature|Punch_Left") {
        setZombieHitReceived(2);
      }
      if (controller.curAnimation === "CharacterArmature|Gun_Shoot") {
        setZombieHitReceived(1);
      }
      console.log(health);
    }

    // Muerte del zombie
    if (health <= 0 && zombieState !== "dying") {
      setZombieState("dying");
    }
  }
}

export default SimpleZombieLogic;
