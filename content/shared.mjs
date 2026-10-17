export const code = text => `<pre><code>${text.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</code></pre>`;
export const table = (headers,rows) => `<div class="table-scroll"><table><thead><tr>${headers.map(x=>`<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
export const figure = (file,alt,caption) => `<figure class="screenshot"><a href="{{assets}}/screens/${file}" target="_blank" rel="noopener"><img src="{{assets}}/screens/${file}" alt="${alt}" width="1920" height="1080" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`;
export const tree = code(`MyGame/
  MyGame.uproject
  Content/
  Plugins/
    ScreenDoctor/
      ScreenDoctor.uplugin
      Resources/
      Source/`);
export const openGraph = code(`OpenScreen
  Create Widget (Class = WBP_UIExample, Owning Player = GetPlayer)
  -> Set Menu = Return Value
  -> Set RootWidget = Menu
  -> Add to Viewport (Target = Menu)
  -> GetRegistry -> Register Widget
       Locator: ScreenId = demo_menu, TestId = title, Context = ""
       Widget: Menu.TitleLabel
  -> GetRegistry -> Register Widget
       Locator: ScreenId = demo_menu, TestId = continue, Context = ""
       Widget: Menu.ContinueButton
  -> Return Menu`);
export const firstSteps = headers => table(headers,[
  ['<code>wait.title</code>','<code>WaitForWidget</code>','<code>Target.ScreenId = demo_menu<br>Target.TestId = title</code>'],
  ['<code>visible.title</code>','<code>AssertVisible</code>','<code>Target.ScreenId = demo_menu<br>Target.TestId = title</code>'],
  ['<code>text.title</code>','<code>AssertText</code>','<code>Target.ScreenId = demo_menu<br>Target.TestId = title<br>ExpectedText = Settings</code>'],
  ['<code>layout.title</code>','<code>AnalyzeLayout</code>','<code>Layout.Targets[0].ScreenId = demo_menu<br>Layout.Targets[0].TestId = title</code>'],
  ['<code>capture.menu</code>','<code>CaptureCheckpoint</code>','<code>CheckpointId = menu_state<br>Compare Baseline = false<br>Timeout Seconds = 15</code>']
]);
export const cli = code(String.raw`$project = 'D:\Games\MyGame\MyGame.uproject'
$editor = 'D:\Epic\UE_5.8\Engine\Binaries\Win64\UnrealEditor-Cmd.exe'
& $editor $project -run=ScreenDoctor -Action=Run -Suite='/Game/UITests/DA_UIFirstSuite.DA_UIFirstSuite' -Mode=EditorStandalone -NullRHI -unattended`);
export const historyCli = code(String.raw`& $editor $project -run=ScreenDoctor -Action=History -OutputRoot='D:\Games\MyGame\Saved\ScreenDoctor' -KeepLast=20 -NullRHI -unattended`);
export const mask = code('{"schemaVersion":1,"masks":[{"name":"clock","reason":"Animated clock","x":30,"y":20,"width":160,"height":40}]}');
