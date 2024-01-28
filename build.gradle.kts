import com.moowork.gradle.node.npm.NpmTask


plugins{
    id("com.github.node-gradle.node") version "2.2.0"
}

apply(plugin = "base")

tasks.register<NpmTask>("appNpmInstall"){
    setWorkingDir(file("${project.projectDir}"))
    setArgs(listOf("install"))
}
tasks.register<NpmTask>("appNpmBuild") {
    setWorkingDir(file("${project.projectDir}"))
    setArgs(listOf("run", "build"))
}


tasks.named("appNpmBuild"){
    dependsOn(tasks["appNpmInstall"])
}

tasks.named("build"){
    dependsOn(tasks["appNpmBuild"])
}