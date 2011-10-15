function Vector2D(x, y) {
    this.x = x;
    this.y = y;
}

Vector2D.prototype.magnitude = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector2D.prototype.add = function(v) {
    return new Vector2D(this.x + v.x, this.y + v.y);
};

Vector2D.prototype.subtract = function(v) {
    return new Vector2D(this.x - v.x, this.y - v.y);
};

Vector2D.prototype.multiply = function(s) {
    return new Vector2D(this.x * s, this.y * s);
};

Vector2D.prototype.divide = function(s) {
    return new Vector2D(this.x / s, this.y / s);
};

Vector2D.prototype.distance = function(v) {
    var dx = v.x - this.x;
    var dy = v.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
};

Vector2D.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y;
};

Vector2D.prototype.normalize = function() {
    var mag = this.magnitude();
    if (mag != 0) {
        return this.divide(mag);
    } else {
        return new Vector2D(0, 0);
    }
};

Vector2D.prototype.scaleTo = function(len) {
    var normalized = this.normalize();
    return normalized.multiply(len);
};

Vector2D.prototype.heading = function() {
    return Math.atan2(this.y, this.x);
}

Vector2D.prototype.limit = function(s) {
    if (this.magnitude() > s) {
        var normalized = this.normalize();        
        return normalized.multiply(s);
    } else {
        return this;
    }
};

Vector2D.prototype.angleBetween = function(v) {
    var dotProduct = this.dot();
    return Math.acos(dotProduct / (this.magnitude() * v.magnitude()));
};