function GameObject() {
    this.position = new Vector2D(0, 0);
    this.velocity = new Vector2D(0, 0);
    this.size = new Vector2D(0, 0);
}

GameObject.prototype.updatePosition = function() {
    this.position = this.position.add(this.velocity);
}

GameObject.prototype.applyForce = function(fx, fy) {
    this.velocity = this.velocity.add(new Vector2D(fx, fy));
}

GameObject.prototype.radius = function() {
    return this.size / 2;
}