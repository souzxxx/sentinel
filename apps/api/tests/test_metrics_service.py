from app.services.metrics import get_system_metrics


def test_get_system_metrics_returns_all_fields():
    data = get_system_metrics()

    assert "timestamp" in data
    assert "cpu" in data
    assert "memory" in data
    assert "disk" in data
    assert "network" in data


def test_cpu_metrics_structure():
    data = get_system_metrics()
    cpu = data["cpu"]

    assert "percent" in cpu
    assert "count" in cpu
    assert isinstance(cpu["percent"], (int, float))
    assert cpu["percent"] >= 0
    assert cpu["count"] > 0


def test_memory_metrics_structure():
    data = get_system_metrics()
    mem = data["memory"]

    assert "percent" in mem
    assert "used_gb" in mem
    assert "total_gb" in mem
    assert 0 <= mem["percent"] <= 100
    assert mem["total_gb"] > 0


def test_disk_metrics_structure():
    data = get_system_metrics()
    disk = data["disk"]

    assert "percent" in disk
    assert "used_gb" in disk
    assert "total_gb" in disk
    assert 0 <= disk["percent"] <= 100


def test_network_metrics_structure():
    data = get_system_metrics()
    net = data["network"]

    assert "bytes_sent" in net
    assert "bytes_recv" in net
    assert net["bytes_sent"] >= 0
    assert net["bytes_recv"] >= 0
